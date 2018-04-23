<?php
/**
 * Dead_Simple_CountDown_Widget class
 *
 * Class that extends WP_Widget and implements the countdown timer widget.
 *
 * @package Dead_Simple_Countdown_Widget
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'Dead_Simple_CountDown_Widget' ) ) {

	/**
	 * Class Dead_Simple_CountDown_Widget
	 */
	class Dead_Simple_CountDown_Widget extends WP_Widget {


		/**
		 * Dead_Simple_CountDown_Widget constructor.
		 */
		public function __construct() {
			$widget_options = array(
				'classname'   => 'dscw-countdown-widget',
				'description' => __( 'Displays a timer that counts down to selected date.', 'dead_simple_countdown' ),
			);
			parent::__construct( 'dscw-countdown-widget', __( 'Dead Simple CountDown', 'dead_simple_countdown' ), $widget_options );
		}


		/**
		 * Settings form for use in wp-admin.
		 *
		 * @param array $instance Current instance of the widget.
		 */
		public function form( $instance ) {

			/**
			 * Filter for modifying the widgets default theme.
			 *
			 * If this is a new instance and there is no theme set this filter
			 * allows you to set the default selected theme option. The returned
			 * value must be a string matching a theme key in the $available_themes array.
			 *
			 * @since 2.0.0
			 *
			 * @param string 'light' Default theme key.
			 */
			$default_theme = apply_filters( 'dscw_default_widget_theme', 'light' );

			$active_theme = ! empty( $instance['theme'] ) ? $instance['theme'] : $default_theme;

			$title_text   = ! empty( $instance['title_text'] ) ? $instance['title_text'] : '';
			$end_date     = ! empty( $instance['end_date'] ) ? $instance['end_date'] : '';
			$end_date_ms  = ! empty( $instance['end_date_ms'] ) ? $instance['end_date_ms'] : '';
			$expired_text = ! empty( $instance['expired_text'] ) ? $instance['expired_text'] : '';

			$available_themes = array(
				'light' => 'Light',
				'dark'  => 'Dark',
				'none'  => 'None',
			);

			/**
			 * Filter for modifying available theme choices in the widget form.
			 *
			 * The value passed is an associative array consisting $keys specifying
			 * the name of the theme and $values specifying the user-facing label text.
			 * $keys are passed through `esc_attr()` so the should not contain <, >, &, ” or ‘
			 * $values are passed through `esc_html()`. An example of a well formatted theme
			 * option would be:
			 *        $available_themes['my-awesome-theme'] = 'My Awesome Theme';
			 *
			 * @since 2.0.0
			 *
			 * @param array $available_themes Associative array in the shape of 'theme-key' => 'Label'.
			 */
			$available_themes = apply_filters( 'dscw_available_widget_themes', $available_themes );

			$theme_options = '';
			foreach ( $available_themes as $theme_key => $label ) {
				$theme_key      = esc_attr( $theme_key );
				$theme_options .= '<option value="' . $theme_key . '" ' . ( ( $theme_key === $active_theme ) ? 'selected' : '' ) . '>'
								  . esc_html( $label ) .
								  '</option>';
			}
			?>
			<div>
				<label for="<?php echo esc_attr( $this->get_field_id( 'title_text' ) ); ?>">Title:</label>
				<input type="text" id="<?php echo esc_attr( $this->get_field_id( 'title_text' ) ); ?>"
					   name="<?php echo esc_attr( $this->get_field_name( 'title_text' ) ); ?>" class="widefat"
					   value="<?php echo esc_attr( $title_text ); ?>"
				/>
			</div>
			<hr>
			<div>
				<label for="<?php echo esc_attr( $this->get_field_id( 'theme' ) ); ?>">Theme:</label>
				<select id="<?php echo esc_attr( $this->get_field_id( 'theme' ) ); ?>"
						name="<?php echo esc_attr( $this->get_field_name( 'theme' ) ); ?>"
				>
					<?php echo $theme_options; // WPCS: XSS ok. All input is escaped when the string is constructed. ?>
				</select>
			</div>
			<hr>
			<div>
				<label for="<?php echo esc_attr( $this->get_field_id( 'end_date' ) ); ?>">
					End Date:
					<input type="text" id="<?php echo esc_attr( $this->get_field_id( 'end_date' ) ); ?>"
						   name="<?php echo esc_attr( $this->get_field_name( 'end_date' ) ); ?>"
						   value="<?php echo esc_attr( $end_date ); ?>"
						   onclick="jQuery(this).datepicker({
							   altField: '#<?php echo esc_js( $this->get_field_id( 'end_date_ms' ) ); ?>',
							   altFormat: '@' // Unix timestamp (ms since 01/01/1970).
							   });
							   jQuery(this).datepicker('show');
							   "
					/>
					<span style="display: block; font-size: 0.9em; margin-top: 4px; color: #656572;">
						Date to count down to.
					</span>
				</label>
				<input type="hidden" id="<?php echo esc_attr( $this->get_field_id( 'end_date_ms' ) ); ?>"
					   name="<?php echo esc_attr( $this->get_field_name( 'end_date_ms' ) ); ?>"
					   value="<?php echo esc_attr( $end_date_ms ); ?>"
				/>
			</div>
			<hr>
			<div>
				<label for="<?php echo esc_attr( $this->get_field_id( 'expired_text' ) ); ?>">
					End Date Text:
					<input type="text" id="<?php echo esc_attr( $this->get_field_id( 'expired_text' ) ); ?>"
						   name="<?php echo esc_attr( $this->get_field_name( 'expired_text' ) ); ?>"
						   value="<?php echo esc_attr( $expired_text ); ?>"
					/>
					<span style="display: block; font-size: 0.9em; margin-top: 4px; color: #656572;">
						Text displayed when countdown expires.
					</span>
				</label>
			</div>

			<?php
		}

		/**
		 * Update logic for this instance.
		 *
		 * @param array $new_instance Widget settings being saved now.
		 * @param array $old_instance Last saved settings for this widget instance.
		 *
		 * @return array $instance Updated widget.
		 */
		public function update( $new_instance, $old_instance ) {
			$instance = $old_instance;

			$instance['title_text'] = sanitize_text_field( $new_instance['title_text'] );

			$instance['theme'] = sanitize_text_field( $new_instance['theme'] );

			$instance['end_date'] = sanitize_text_field( $new_instance['end_date'] );

			$instance['expired_text'] = sanitize_text_field( $new_instance['expired_text'] );

			// If $new_instance['end_date_ms'] is a valid integer, save it, else set value to empty string.
			$instance['end_date_ms'] = ( (int) $new_instance['end_date_ms'] ) ? $new_instance['end_date_ms'] : '';

			return $instance;
		}

		/**
		 * Renders widget output.
		 *
		 * @param array $args An array of default widget arguments.
		 * @param array $instance The current widget instance's settings.
		 */
		public function widget( $args, $instance ) {
			wp_enqueue_script( 'dead-simple-countdown-widget-js' );
			wp_enqueue_style( 'dead-simple-countdown-widget-styles' );

			/**
			 * Action fired when frontend rendering starts.
			 *
			 * This is a great place to enqueue any custom theme CSS.
			 *
			 * @since 2.0.0
			 *
			 * @param string $instance['theme']    Currently selected theme key.
			 * @param string $this->id             Unique ID string of the current instance (id_base-number).
			 */
			do_action( 'dscw_start_widget_render', $instance['theme'], $this->id );

			// UNIX timestamp in milliseconds of the date the countdown is set to expire.
			$end_date_ms = $instance['end_date_ms'];
			// Text to display when countdown expires.
			$expired_text = $instance['expired_text'];

			// Check if we are using a theme and set the CSS class accordingly.
			switch ( $instance['theme'] ) {
				case 'light':
					$container_class = 'dscw-countdown-theme-light ';
					break;
				case 'dark':
					$container_class = 'dscw-countdown-theme-dark ';
					break;
				default:
					$container_class = '';
					break;
			}

			/**
			 * Filter for modifying the HTML class attribute applied to the primary widget container.
			 *
			 * Allows modifying the class names added to this instance's container element.
			 * Built in themes add a class to this element that's used as the root CSS selector.
			 * Be sure to only append to $container_class if you do not want to overwrite the built in theme classes.
			 *
			 * @since 2.0.0
			 *
			 * @param string $container_class      Class name to be added to timer's container element.
			 * @param string $instance['theme']    Currently selected theme key.
			 * @param string $this->id             Unique ID string of the current instance (id_base-number).
			 */
			$container_class = apply_filters( 'dscw_container_element_class_attribute', $container_class, $instance['theme'], $this->id );

			// If a theme is set then add an class for inner wrap.
			$inner_theme_class = $container_class ? 'dscw-countdown-theme-inner' : '';

			$content = '';
			// Primary container element. This will carry our options to the front-end via data attributes.
			$content .= '<div 
		                class="dscw-countdown-instance ' . esc_attr( $container_class ) . '" 
		                data-instance="' . esc_attr( $this->id ) . '" 
		                data-end-date="' . esc_attr( $end_date_ms ) . '" 
		                data-expired-text="' . esc_attr( $expired_text ) . '"
		             >';

			// Inner theme wrapper. This class is empty when $container_class is empty.
			$content .= '<div class="' . esc_attr( $inner_theme_class ) . '">';

			// Only add title if it's set.
			if ( $instance['title_text'] ) {
				$content .= '<h3>' . sanitize_text_field( $instance['title_text'] ) . '</h3>';
			}

			// Mount point to build the countdown in.
			$content .= '<div id="timer-mount-' . esc_attr( $this->id ) . '"></div>';

			$content .= '</div>'; // Close inner theme wrapper.
			$content .= '</div>'; // Close primary container.

			$output = $args['before_widget'] . $content . $args['after_widget'];

			// Echo out rendered HTML.
			echo $output; // WPCS: XSS ok. We don't need PHPCS to yell at us here because we escape everything above.
		}
	}
}

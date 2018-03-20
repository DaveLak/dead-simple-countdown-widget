<?php
if ( ! defined( 'ABSPATH' ) ) {
	die();
}


/**
 * Class Dead_Simple_CountDown_Widget
 */
if ( ! class_exists( 'Dead_Simple_CountDown_Widget' ) ) {

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
		 * Settings form.
		 *
		 * @param array $instance Current instance of the widget.
		 */
		public function form( $instance ) {

			$title_text   = ! empty( $instance['title_text'] ) ? $instance['title_text'] : '';
			$end_date     = ! empty( $instance['end_date'] ) ? $instance['end_date'] : '';
			$end_date_ms  = ! empty( $instance['end_date_ms'] ) ? $instance['end_date_ms'] : '';
			$expired_text = ! empty( $instance['expired_text'] ) ? $instance['expired_text'] : '';

			// If no theme is set default to "light".
			$theme = ! empty( $instance['theme'] ) ? $instance['theme'] : 'light';

			ob_start();
			?>
			<p>
				<label for="<?php echo $this->get_field_id( 'title_text' ); ?>">Title:</label>
				<input type="text" id="<?php echo $this->get_field_id( 'title_text' ); ?>"
					   name="<?php echo $this->get_field_name( 'title_text' ); ?>" class="widefat"
					   value="<?php echo esc_attr( $title_text ); ?>"
				/>
			</p>
			<hr>
			<p>
				<label for="<?php echo $this->get_field_id( 'theme' ); ?>">Theme:</label>
				<select name="<?php echo $this->get_field_name( 'theme' ); ?>"
						id="<?php echo $this->get_field_id( 'theme' ); ?>">
					<option value="light" <?php echo 'light' === $theme ? 'selected' : ''; ?>>Light</option>
					<option value="dark" <?php echo 'dark' === $theme ? 'selected' : ''; ?>>Dark</option>
					<option value="none"<?php echo 'none' === $theme ? 'selected' : ''; ?>>None</option>
				</select>
			</p>
			<hr>
			<p>
				<label for="<?php echo $this->get_field_id( 'end_date' ); ?>">
					End Date:
					<input type="text" id="<?php echo $this->get_field_id( 'end_date' ); ?>"
						   name="<?php echo $this->get_field_name( 'end_date' ); ?>"
						   value="<?php echo $end_date; ?>"
						   onclick="jQuery(this).datepicker({
										altField: '#<?php echo $this->get_field_id( 'end_date_ms' ); ?>',
										altFormat: '@'
									});
								   jQuery(this).datepicker('show');
								   "
					/>
					<span style="display: block; font-size: 0.9em; margin-top: 4px; color: #656572;" >
						Date to count down to.
					</span>
				</label>
				<input type="hidden" id="<?php echo $this->get_field_id( 'end_date_ms' ); ?>"
					   name="<?php echo $this->get_field_name( 'end_date_ms' ); ?>"
					   value="<?php echo $end_date_ms; ?>"
				/>
			</p>
			<hr>
			<p>
				<label for="<?php echo $this->get_field_id( 'expired_text' ); ?>">
					End Date Text:
					<input type="text" id="<?php echo $this->get_field_id( 'expired_text' ); ?>"
						   name="<?php echo $this->get_field_name( 'expired_text' ); ?>"
						   value="<?php echo $expired_text; ?>"
					/>
					<span style="display: block; font-size: 0.9em; margin-top: 4px; color: #656572;">
						Text displayed when countdown expires.
					</span>
				</label>
			</p>

			<?php
			echo ob_get_clean();
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

			$instance['end_date_ms'] = sanitize_text_field( $new_instance['end_date_ms'] );

			$instance['expired_text'] = sanitize_text_field( $new_instance['expired_text'] );

			return $instance;
		}

		/**
		 * @param array $args An array of default widget arguments.
		 * @param array $instance The current widget instance's settings.
		 */
		public function widget( $args, $instance ) {
			wp_enqueue_script( 'dead-simple-countdown-widget-js' );
			wp_enqueue_style( 'dead-simple-countdown-widget-styles' );

			// UNIX timestamp in milliseconds of the date the countdown is set to expire.
			$endDate_ms = $instance['end_date_ms'];
			// Text to display when countdown expires.
			$expiredText = $instance['expired_text'];

			// Check if we are using a theme and set the CSS class accordingly.
			switch ( $instance['theme'] ) {
				case 'light':
					$themeClass = 'dscw-countdown-theme-light';
					break;
				case 'dark':
					$themeClass = 'dscw-countdown-theme-dark';
					break;
				default:
					$themeClass = '';
					break;
			}

			// If a theme is set then add an class for inner wrap.
			$innerThemeClass = $themeClass ? 'dscw-countdown-theme-inner' : '';

			$content = '';
			// Primary container element. This will carry our options to the front-end via data attributes.
			$content .= '<div 
		                class="dscw-countdown-instance ' . $themeClass . '" 
		                data-instance="' . $this->id . '" 
		                data-end-date="' . $endDate_ms . '" 
		                data-expired-text="' . $expiredText . '"
		             >';
			// Inner theme wrapper. This gives us another selector to style with.
			$content .= '<div class="' . $innerThemeClass . '">';
			$content .= '<h3>' . $instance['title_text'] . '</h3>';
			// Mount point to build the countdown in.
			$content .= '<div id="timer-mount-' . $this->id . '"></div>';
			$content .= '</div>'; // Close inner theme wrapper.
			$content .= '</div>'; // Close primary container.

			$output = $args['before_widget'] . $content . $args['after_widget'];
			echo $output;

		}
	}
}

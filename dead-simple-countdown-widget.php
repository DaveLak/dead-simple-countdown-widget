<?php
/**
 * Plugin Name: Dead Simple Countdown Widget
 * Plugin URI: https://github.com/DaveLak/dead-simple-countdown-widget
 * Description: A dead simple plugin that adds a countdown timer widget
 * Author: David Lakin
 * Version: 1.0.3
 * Author URI: #
 * License: GPLv2 or later
 * Text Domain: dead_simple_countdown
 *
 * @package   Dead_Simple_Countdown_Widget
 * @since 1.0.0
 *
 * @author    David Lakin <info@themoderndev.com>
 * @license   GPLv2 or later
 * @link      https://github.com/DaveLak/dead-simple-countdown-widget
 * @copyright Copyright (c) 2018, David Lakin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The absolute URL to this file **WITH trailing slash**.
 * Used when requesting assets.
 */
define( 'DSCW_COUNTDOWN_TIMER_URL', plugin_dir_url( __FILE__ ) );
/**
 * The absolute filesystem directory path to this file **WITH trailing slash**.
 * Used when including PHP files
 */
define( 'DSCW_COUNTDOWN_TIMER_PATH', plugin_dir_path( __FILE__ ) );


/**
 * Register CountDown widget class
 */
function dscw_countdown_register_widget() {
	/**
	 * Require Dead_Simple_CountDown_Widget class.
	 */
	require_once DSCW_COUNTDOWN_TIMER_PATH . 'inc/countdown-widget.php';

	register_widget( 'Dead_Simple_CountDown_Widget' );
}

add_action( 'widgets_init', 'dscw_countdown_register_widget' );

/**
 * Register scripts and styles for use in the front end
 */
function dscw_countdown_register_assets() {
	// Front end JS.
	wp_register_script(
		'dead-simple-countdown-widget-js',
		DSCW_COUNTDOWN_TIMER_URL . 'assets/front-end/js/countdown-timer.js',
		array( 'jquery' ),
		'1.0.3',
		true
	);
	// Front end styles.
	wp_register_style(
		'dead-simple-countdown-widget-styles',
		DSCW_COUNTDOWN_TIMER_URL . 'assets/front-end/css/countdown-timer.css',
		array(),
		'1.0.2'
	);

}

add_action( 'wp_enqueue_scripts', 'dscw_countdown_register_assets' );

/**
 * Register scripts and styles for use in the admin
 *
 * @param string $page The current admin page.
 */
function dscw_countdown_admin_scripts( $page ) {
	// Admin Styles.
	wp_register_style(
		'dscw-jquery-base-theme-styles',
		DSCW_COUNTDOWN_TIMER_URL . 'assets/admin/css/jquery-ui-base-theme.css',
		array(),
		'1.0.0'
	);

	// Enqueue only if we are on widgets page.
	if ( 'widgets.php' === $page ) {
		wp_enqueue_script( 'jquery-ui-datepicker' );
		wp_enqueue_style( 'dscw-jquery-base-theme-styles' );
	}
}

add_action( 'admin_enqueue_scripts', 'dscw_countdown_admin_scripts' );

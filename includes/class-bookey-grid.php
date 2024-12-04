<?php
/**
 * Main class of the plugin.
 *
 * @package bookey-grid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Bookey_Grid
 */
class Bookey_Grid {

	/**
	 * Plugin option name.
	 *
	 * @const string
	 */
	private const OPTION_NAME = 'bookeyltd_settings';

	/**
	 * Default settings of the plugin.
	 *
	 * @const array
	 */
	private const OPTION_DEFAULTS = array(
		'ownerKey'             => '',
		'language'             => 'en',
		'minimalBookingPeriod' => '30',
		'workingHours'         => '8,18',
		'workingDays'          => '1,2,3,4,5,6,7',
		'workingMonths'        => '1,2,3,4,5,6,7,8,9,10,11,12',
		'subscription'         => 'demo',
		'error'                => true,
		'errorMessage'         => '',
		'calendar'             => true,
		'days'                 => '7',
		'loginPage'            => '',
		'lastCheck'            => 0,
	);

	/**
	 * Data to send into Javascript variable.
	 *
	 * @var array
	 *
	 * @see \Bookey_Grid::localize().
	 */
	private $g_user;

	/**
	 * Bookey_Grid constructor.
	 */
	public function __construct() {
		load_plugin_textdomain( 'bookey-table', false, basename( dirname( __DIR__ ) ) . '/languages' );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'init', array( $this, 'register_custom_block' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_shortcode( 'bookey_grid', array( $this, 'shortcode' ) );

		$this->g_user = array(
			'_id'   => '',
			'admin' => false,
		);

		add_action(
			'bookey_check_subscription',
			array(
				$this,
				'check_subscription',
			)
		);
		if ( ! wp_next_scheduled( 'bookey_check_subscription' ) ) {
			wp_schedule_event( time(), 'daily', 'bookey_check_subscription' );
		}
	}

	/**
	 * Implements [bookey_grid] shortcode.
	 *
	 * @return string
	 */
	public function shortcode() {
		wp_enqueue_script( 'bookey-build-view-script' );
		wp_enqueue_style( 'bookey-build-style' );
		ob_start();
		include dirname( __DIR__ ) . '/build/render.php';

		return ob_get_clean();
	}

	/**
	 * Registers the option for the plugin settings.
	 */
	public function register_settings() {
		register_setting(
			self::OPTION_NAME,
			self::OPTION_NAME,
			array(
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
				'type'              => 'array',
			)
		);
	}

	/**
	 * Sanitizes the plugin settings before saving to the database.
	 *
	 * @param array|null|string $input Data to sanitize.
	 *
	 * @return array
	 */
	public function sanitize_settings( $input ) {
		$settings = array();
		if ( ! is_array( $input ) ) {
			$input = array();
		}
		foreach ( self::OPTION_DEFAULTS as $key => $value ) {
			$new_value = isset( $input[ $key ] ) ? sanitize_text_field( $input[ $key ] ) : '';
			if ( ! $new_value ) {
				$new_value = $value;
			}
			$settings[ $key ] = $new_value;
		}

		if ( '' !== ! $input['ownerKey'] ) {
			$data = $this->get_service_data( $input['ownerKey'] );

			$subscription = empty( $data['subscription'] ) ? '' : $data['subscription'];

			$settings['subscription'] = $subscription;
			if ( ! $subscription || 'demo' === $subscription ) {
				$settings['days'] = '7';
			}
		} else {
			$data = array(
				'error'        => 1,
				'errorMessage' => 'Unknown error',
			);
		}
		$data['lastCheck'] = time();

		return array_merge( $settings, $data );
	}

	/**
	 * Registers the custom Gutenberg block.
	 */
	public function register_custom_block() {
		register_block_type(
			dirname( __DIR__ ) . '/build',
			array(
				'attributes' => array(
					'language' => array(
						'type' => 'string',
					),
				),
			)
		);
		wp_localize_script( 'bookey-build-view-script', 'inbound', $this->localize() );
	}

	/**
	 * Returns Javascript variable used with the Gutenberg block or shortcode
	 * output.
	 *
	 * @return array[]
	 */
	public function localize() {
		$settings = $this->get_settings();

		$data = array(
			'user'   => array(),
			'plugin' => array(),
		);

		if ( is_user_logged_in() ) {
			$user                     = wp_get_current_user();
			$data['user']['_id']      = $user->data->ID;
			$data['user']['admin']    = in_array( 'administrator', $user->roles, true ) || in_array( 'editor', $user->roles, true );
			$data['user']['email']    = $user->data->user_email;
			$data['user']['name']     = $user->data->user_login;
			$data['user']['lastName'] = $user->data->user_nicename;
			$data['user']['fullName'] = $user->data->display_name;
		} else {
			$data['user']['_id']      = '';
			$data['user']['admin']    = false;
			$data['user']['email']    = '';
			$data['user']['name']     = '';
			$data['user']['lastName'] = '';
		}

		$this->g_user['_id']   = $data['user']['_id'];
		$this->g_user['admin'] = $data['user']['admin'];

		$data['plugin']['domain']               = wp_parse_url( get_site_url(), PHP_URL_HOST );
		$data['plugin']['minimalBookingPeriod'] = $settings['minimalBookingPeriod'];
		$data['plugin']['subscription']         = $settings['subscription'];
		$data['plugin']['workingHours']         =
			array_map( 'intval', explode( ',', $settings['workingHours'] ) );

		$data['plugin']['workingDays'] = empty( $settings['workingDays'] )
			? array() : array_map( 'intval', explode( ',', $settings['workingDays'] ) );

		$data['plugin']['workingMonths'] = empty( $settings['workingMonths'] )
			? array() : array_map( 'intval', explode( ',', $settings['workingMonths'] ) );

		$data['plugin']['calendar']  = $settings['calendar'];
		$data['plugin']['days']      = $settings['days'];
		$data['plugin']['loginPage'] = empty( $settings['loginPage'] ) ? wp_login_url() : $settings['loginPage'];

		$data['language'] = $settings['language'];
		$data['error']    = wp_json_encode( $settings['error'] );

		return $data;
	}

	/**
	 * Loads the plugin settings.
	 *
	 * @return array
	 */
	public function get_settings() {
		$option = get_option( self::OPTION_NAME, array() );

		return array_merge( self::OPTION_DEFAULTS, $option );
	}

	/**
	 * Adds plugin setting page to the WP Admin menu.
	 */
	public function admin_menu() {
		add_menu_page(
			__( 'BooKey Settings Page', 'bookey-table' ),
			__( 'BooKey', 'bookey-table' ),
			'manage_options',
			'bookey_table',
			array( $this, 'options_page' ),
			'dashicons-admin-network',
			100
		);
	}

	/**
	 * Sends request to BooKye server to receive server-side settings for the
	 * given owner key.
	 *
	 * @param string $owner_key Plugin key to identify your website account on
	 *     BooKey.
	 *
	 * @return array
	 */
	private function get_service_data( $owner_key ) {
		$url = 'https://bookey.ltd/api/plugin/get';

		$response = wp_remote_post(
			$url,
			array(
				'timeout'     => 45,
				'redirection' => 5,
				'body'        => array( 'pluginId' => $owner_key ),
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message            = $response->get_error_message();
			$settings['error']        = true;
			$settings['errorMessage'] = $error_message;
		} else {
			$result = json_decode( wp_remote_retrieve_body( $response ) );

			if ( is_object( $result ) && property_exists( $result, 'result' ) ) {
				foreach ( array_keys( self::OPTION_DEFAULTS ) as $key ) {
					if ( isset( $result->$key ) ) {
						if ( is_array( $result->$key ) ) {
							$settings[ $key ] = implode( ',', $result->$key );
						} else {
							$settings[ $key ] = $result->$key;
						}
					}
				}
				$settings['error'] = false;

				if ( ! $result->result ) {
					$settings['error']        = true;
					$settings['errorMessage'] = 'key';
				}

				if ( property_exists( $result, 'domain' ) && wp_parse_url( get_site_url(), PHP_URL_HOST ) !== $result->domain ) {
					$settings['error']        = true;
					$settings['errorMessage'] = 'address';
				}

				if ( property_exists( $result, 'error' ) && 'expired' === $result->error ) {
					$settings['error']        = true;
					$settings['errorMessage'] = 'tariff';
				}
			} else {
				$settings['error']        = true;
				$settings['errorMessage'] = 'unreachable';
			}
		}

		$settings = array_filter(
			$settings,
			function ( $value, $index ) {
				return 'error' === $index || 'errorMessage' === $index || ! empty( $value );
			},
			ARRAY_FILTER_USE_BOTH
		);

		return $settings;
	}

	/**
	 * Helper to print available days of week on the settings page.
	 *
	 * @param string $days List of days comma separated.
	 */
	private static function form_days( $days = '' ) {
		$days_array = explode( ',', $days );
		if ( '' === $days || count( $days_array ) === 7 ) {
			esc_html_e( 'All week', 'bookey-table' );
		} else {
			sort( $days_array );

			foreach ( $days_array as $value ) {
				if ( '1' === $value ) {
					esc_html_e( 'mo', 'bookey-table' );
				}
				if ( '2' === $value ) {
					esc_html_e( 'tu', 'bookey-table' );
				}
				if ( '3' === $value ) {
					esc_html_e( 'we', 'bookey-table' );
				}
				if ( '4' === $value ) {
					esc_html_e( 'th', 'bookey-table' );
				}
				if ( '5' === $value ) {
					esc_html_e( 'fr', 'bookey-table' );
				}
				if ( '6' === $value ) {
					esc_html_e( 'sa', 'bookey-table' );
				}
				if ( '7' === $value ) {
					esc_html_e( 'su', 'bookey-table' );
				}
				if ( $value < 7 ) {
					echo ', ';
				}
			}
		}
	}

	/**
	 * Helper to print available months on the settings page.
	 *
	 * @param string $months List of months comma separated.
	 */
	private static function form_months( $months = '' ) {
		$months_array = explode( ',', $months );
		if ( '' === $months || count( $months_array ) === 12 ) {
			esc_html_e( 'All year', 'bookey-table' );
		} else {
			sort( $months_array );

			foreach ( $months_array as $value ) {
				if ( '1' === $value ) {
					esc_html_e( 'jan', 'bookey-table' );
				}
				if ( '2' === $value ) {
					esc_html_e( 'feb', 'bookey-table' );
				}
				if ( '3' === $value ) {
					esc_html_e( 'mar', 'bookey-table' );
				}
				if ( '4' === $value ) {
					esc_html_e( 'apr', 'bookey-table' );
				}
				if ( '5' === $value ) {
					esc_html_e( 'may', 'bookey-table' );
				}
				if ( '6' === $value ) {
					esc_html_e( 'jun', 'bookey-table' );
				}
				if ( '7' === $value ) {
					esc_html_e( 'jul', 'bookey-table' );
				}
				if ( '8' === $value ) {
					esc_html_e( 'aug', 'bookey-table' );
				}
				if ( '9' === $value ) {
					esc_html_e( 'sep', 'bookey-table' );
				}
				if ( '10' === $value ) {
					esc_html_e( 'oct', 'bookey-table' );
				}
				if ( '11' === $value ) {
					esc_html_e( 'nov', 'bookey-table' );
				}
				if ( '12' === $value ) {
					esc_html_e( 'dec', 'bookey-table' );
				}
				if ( $value < 12 ) {
					echo ', ';
				}
			}
		}
	}

	/**
	 * Helper to print form input name parameter in the settings form.
	 *
	 * @param $string $key Key in option array.
	 */
	private static function input_name( $key ) {
		echo esc_attr( self::OPTION_NAME . '[' . $key . ']' );
	}

	/**
	 * Content of the plugin settings page.
	 */
	public function options_page() {
		$option = $this->get_settings();
		if ( time() - (int) $option['ownerKey'] > MINUTE_IN_SECONDS ) {
			$this->check_subscription();
			$option = $this->get_settings();
		}

		$parts = explode( ',', $option['workingHours'] );
		$from  = $parts[0];
		$to    = $parts[1];
		?>
		<div class="<?php echo 1 === (int) $option['error'] ? 'notice notice-error is-dismissible' : 'hidden'; ?>">
			<p>
				<?php
				if ( 1 === (int) $option['error'] ) {
					switch ( $option['errorMessage'] ) {
						case 'address':
							echo esc_html( __( 'Please set the following "Website address" in plugin settings: ', 'bookey-table' ) . ' ' . wp_parse_url( get_site_url(), PHP_URL_HOST ) );
							break;
						case 'key':
							echo esc_html( __( 'BooKey remote options read error: Incorrect plugin key.', 'bookey-table' ) );
							break;
						case 'tariff':
							echo esc_html( __( 'Tariff is expired or not selected.', 'bookey-table' ) );
							break;
						case 'unreachable':
							echo esc_html( __( 'BooKey server is unreachable!', 'bookey-table' ) );
							break;
						default:
							echo esc_html( __( 'BooKey server access error:', 'bookey-table' ) . $option['errorMessage'] );
					}
				}
				?>
			</p>
		</div>
		<div class="wrap">
			<h1><?php esc_html_e( 'BooKey Grid Plugin Settings', 'bookey-table' ); ?></h1>

			<form method="POST" action="options.php">
				<?php settings_fields( self::OPTION_NAME ); ?>

				<table class="form-table" role="presentation">

					<tr>
						<th scope="row"><?php esc_html_e( 'Plugin Key', 'bookey-table' ); ?></th>
						<td>
							<input type="text" size="32"
									name="<?php self::input_name( 'ownerKey' ); ?>"
									value="<?php echo esc_attr( $option['ownerKey'] ); ?>">
							<p class="description">
								<?php esc_html_e( 'On submitting this form the BooKey server receives the plugin key and returns your account settings', 'bookey-table' ); ?>
							</p>
							<p class="description">
								<a target="_blank"
									href="https://bookey.ltd/en/docs/terms"><?php esc_html_e( 'Terms &amp; Conditions', 'bookey-table' ); ?></a>
							</p>
						</td>
					</tr>

				</table>
				<table style="<?php echo 1 === (int) $option['error'] ? 'display: none;' : ''; ?>"
						class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Language', 'bookey-table' ); ?></th>
						<td>
							<select name="<?php self::input_name( 'language' ); ?>">
								<option value="en" <?php echo 'en' === $option['language'] ? 'selected' : ''; ?>>
									English
								</option>
								<option value="uk" <?php echo 'uk' === $option['language'] ? 'selected' : ''; ?>>
									Українська
								</option>
								<option value="ru" <?php echo 'ru' === $option['language'] ? 'selected' : ''; ?>>
									Русский
								</option>
							</select>
							<p class="description"><?php esc_html_e( 'Choose table language', 'bookey-table' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Login URL', 'bookey-table' ); ?></th>
						<td>
							<input type="text" size="32"
									name="<?php self::input_name( 'loginPage' ); ?>"
									value="<?php echo esc_attr( $option['loginPage'] ); ?>">
							<p class="description">
								<?php esc_html_e( 'Leave it empty if you use standard URL:', 'bookey-table' ); ?>
								<code><?php echo esc_html( wp_login_url() ); ?></code>
							</p>
							<p class="description">
								<?php esc_html_e( 'Your website visitors must be logged in for booking.', 'bookey-table' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Show Calendar', 'bookey-table' ); ?></th>
						<td>
							<select name="<?php self::input_name( 'calendar' ); ?>">
								<option value=true <?php echo 'true' === $option['calendar'] ? 'selected' : ''; ?>>
									<?php esc_html_e( 'Show', 'bookey-table' ); ?>
								</option>
								<option value=false <?php echo 'false' === $option['calendar'] ? 'selected' : ''; ?>>
									<?php esc_html_e( 'Hide', 'bookey-table' ); ?>
								</option>
							</select>
							<p class="description"><?php esc_html_e( 'Show or hide calendar and extra information on page', 'bookey-table' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Table Size', 'bookey-table' ); ?></th>
						<td>
							<select name="<?php self::input_name( 'days' ); ?>">
								<option value="7" <?php echo '7' === $option['days'] ? 'selected' : ''; ?>>
									<?php esc_html_e( 'Week', 'bookey-table' ); ?>
								</option>
								<?php
								if ( empty( $option['subscription'] ) || 'demo' === $option['subscription'] ) :
									?>
							</select>
							<span class="description"><?php esc_html_e( 'Only `Week` option is available in basic subscription', 'bookey-table' ); ?></span>
							<?php else : ?>
								<option value="14" <?php echo '14' === $option['days'] ? 'selected' : ''; ?>>
									<?php esc_html_e( 'Two weeks', 'bookey-table' ); ?>
								</option>
								<option value="30" <?php echo '30' === $option['days'] ? 'selected' : ''; ?>>
									<?php esc_html_e( 'Month', 'bookey-table' ); ?>
								</option>
								</select>

								<?php
							endif;
							?>
							<p class="description"><?php esc_html_e( 'Select static table size', 'bookey-table' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row" colspan="2">
							<?php echo esc_html_e( 'Plugin Server Side Settings', 'bookey-table' ); ?>
						</th>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Minimal Booking Step', 'bookey-table' ); ?></th>
						<td>
							<?php echo esc_html( $option['minimalBookingPeriod'] ); ?>

							<?php esc_html_e( 'minutes', 'bookey-table' ); ?>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Working Hours', 'bookey-table' ); ?></th>
						<td>
							<div> <?php echo esc_html( $from ); ?>:00
								- <?php echo esc_html( $to ); ?>:00
							</div>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Working Days', 'bookey-table' ); ?></th>
						<td>
							<div> <?php self::form_days( $option['workingDays'] ); ?></div>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Working Months', 'bookey-table' ); ?></th>
						<td>
							<div> <?php self::form_months( $option['workingMonths'] ); ?></div>
						</td>
					</tr>
				</table>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'BooKey Website', 'bookey-table' ); ?></th>
						<td>
							<a href="https://bookey.ltd/plugin"
								target="_blank">
								<?php
								esc_html_e( 'Change plugin settings', 'bookey-table' );
								?>
							</a>
						</td>
					</tr>

				</table>
				<?php submit_button( esc_html( __( 'Save Changes', 'bookey-table' ) ) ); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Send request to Bookey server.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @param string           $route Route.
	 *
	 * @return mixed|object
	 */
	public function post_request( $request, $route ) {
		$settings = $this->get_settings();

		$parameters = $request->get_params();

		$parameters['pluginId'] = $settings['ownerKey'];

		$url = 'https://bookey.ltd/api/plugin/' . $route;

		$response = wp_remote_post(
			$url,
			array(
				'timeout'     => 45,
				'redirection' => 5,
				'body'        => array( 'data' => wp_json_encode( $parameters ) ),
			)
		);

		if ( is_wp_error( $response ) ) {
			$result = (object) array( 'status' => 400 );
		} else {
			$result = json_decode( wp_remote_retrieve_body( $response ) );
		}

		return $result;
	}

	/**
	 * Implements 'add' REST API requests.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @return array|object
	 */
	public function add_request( $request ) {
		return $this->post_request( $request, 'addrequests' );
	}

	/**
	 * Implements 'get' REST API requests.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @return array|object
	 */
	public function get_requests( $request ) {
		return $this->post_request( $request, 'getrequests' );
	}

	/**
	 * Implements 'reject' REST API requests.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @return array|object
	 */
	public function reject_requests( $request ) {
		return $this->post_request( $request, 'rejectrequests' );
	}

	/**
	 * Implements 'approve' REST API requests.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @return array|object
	 */
	public function approve_request( $request ) {
		return $this->post_request( $request, 'approverequest' );
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 *
	 * @see \Bookey_Grid::rest_api_init().
	 */
	public function is_admin() {
		return $this->g_user['admin'];
	}

	/**
	 * Permission callback.
	 *
	 * @return bool
	 *
	 * @see \Bookey_Grid::rest_api_init().
	 */
	public function is_logged_in() {
		return '' !== $this->g_user['_id'];
	}

	/**
	 * Permission callback.
	 *
	 * @param \WP_REST_Request $request WP_REST_Request.
	 *
	 * @return bool
	 *
	 * @see \Bookey_Grid::rest_api_init().
	 */
	public function can_reject( $request ) {
		$params = $request->get_params();

		return ( $params['user']['_id'] === $this->g_user['_id'] ) || $this->g_user['admin'];
	}

	/**
	 * Registers custom routes for WP REST API.
	 */
	public function rest_api_init() {
		$namespace = 'bookey/request';

		register_rest_route(
			$namespace,
			'add',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'add_request' ),
				'permission_callback' => array( $this, 'is_logged_in' ),
			)
		);

		register_rest_route(
			$namespace,
			'get',
			array(
				'methods'  => 'POST',
				'callback' => array( $this, 'get_requests' ),
			)
		);

		register_rest_route(
			$namespace,
			'reject',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'reject_requests' ),
				'permission_callback' => array( $this, 'can_reject' ),
			)
		);

		register_rest_route(
			$namespace,
			'approve',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'approve_request' ),
				'permission_callback' => array( $this, 'is_admin' ),
			)
		);
	}

	/**
	 * Check subscription changes (upgrade/downgrade/expire, etc.).
	 */
	public function check_subscription() {
		update_option( self::OPTION_NAME, $this->sanitize_settings( $this->get_settings() ) );
	}
}

new Bookey_Grid();

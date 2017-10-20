<?php
//
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Laravel\Lumen\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
//        'App\Console\Commands\ActivateLicense',
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
		//48小时内未支付取消订单
		$schedule->call(function () {
			$time = time();
			$expir = $time - 3600 * 48;

			\DB::table('order_info')->where([
				['add_time',  '<=', $expir],
				['is_car',     '=',    '0'],
				['pay_status', '=',    '0'],
				['order_status', '!=',    '3'],
			])->update(['order_status' => '3']);
		})->everyMinute();
		//计算普通保险过到保时间
		$schedule->call(function () {
			$time = time();
			 \DB::table('user_policy')
				->leftJoin('order_info', 'user_policy.order_id', '=', 'order_info.order_id')
				->where([
					['user_policy.end_time', '<=', $time],
					['order_info.pay_status', '=', '2'],
					['order_info.order_status', '=', '1'],
				])->update(['order_info.order_status' => '6']);
		})->everyMinute();

		//计算汽车保险过到保时间
		$schedule->call(function () {
			$time = time();
			\DB::table('user_car_policy')
				->leftJoin('order_info', 'user_car_policy.order_id', '=', 'order_info.order_id')
				->where([
					['user_car_policy.end_time', '<=', $time],
					['order_info.pay_status', '=', '2'],
					['order_info.order_status', '=', '1'],
				])->update(['order_info.order_status' => '6']);
		})->everyMinute();
    }
}

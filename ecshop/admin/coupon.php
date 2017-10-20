<?php

/**
 * ECSHOP 会员帐目管理(包括预付款，余额)
 * ============================================================================
 * * 版权所有 2005-2012 上海商派网络科技有限公司，并保留所有权利。
 * 网站地址: http://91bao.cc；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和
 * 使用；不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * $Author: liubo $
 * $Id: user_account.php 17217 2011-01-19 06:29:08Z liubo $
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

/* act操作项的初始化 */
if (empty($_REQUEST['act']))
{
	$_REQUEST['act'] = 'list';
}
else
{
	$_REQUEST['act'] = trim($_REQUEST['act']);
}

/*------------------------------------------------------ */
//-- 会员余额记录列表
/*------------------------------------------------------ */
if ($_REQUEST['act'] == 'list')
{
	/* 权限判断 */
	admin_priv('surplus_manage');

	/* 指定会员的ID为查询条件 */
	$user_id = !empty($_REQUEST['id']) ? intval($_REQUEST['id']) : 0;

	/* 获得支付方式列表 */
	$payment = array();
	$sql = "SELECT pay_id, pay_name FROM ".$ecs->table('payment').
		" WHERE enabled = 1 AND pay_code != 'cod' ORDER BY pay_id";
	$res = $db->query($sql);

	while ($row = $db->fetchRow($res))
	{
		$payment[$row['pay_name']] = $row['pay_name'];
	}

	/* 模板赋值 */
	if (isset($_REQUEST['process_type']))
	{
		$smarty->assign('process_type_' . intval($_REQUEST['process_type']), 'selected="selected"');
	}
	if (isset($_REQUEST['is_paid']))
	{
		$smarty->assign('is_paid_' . intval($_REQUEST['is_paid']), 'selected="selected"');
	}
	$smarty->assign('ur_here',       $_LANG['09_user_account']);
	$smarty->assign('id',            $user_id);
	$smarty->assign('payment_list',  $payment);
	$smarty->assign('action_link',   array('text' => '添加优惠券', 'href'=>'coupon.php?act=add'));

	$list = account_list();
	$smarty->assign('list',         $list['list']);
	$smarty->assign('filter',       $list['filter']);
	$smarty->assign('record_count', $list['record_count']);
	$smarty->assign('page_count',   $list['page_count']);
	$smarty->assign('full_page',    1);

	assign_query_info();
	$smarty->display('coupon_list.htm');
}

/*------------------------------------------------------ */
//-- 添加/编辑会员余额页面
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'add' || $_REQUEST['act'] == 'edit')
{
	admin_priv('surplus_manage'); //权限判断

	$ur_here  = ($_REQUEST['act'] == 'add') ? $_LANG['surplus_add'] : $_LANG['surplus_edit'];
	$form_act = ($_REQUEST['act'] == 'add') ? 'insert' : 'update';
	$id       = isset($_GET['id']) ? intval($_GET['id']) : 0;

	if ($_REQUEST['act'] == 'edit')
	{
		/* 取得会员名称 */
		$sql = "SELECT * FROM " .$ecs->table('coupon'). " WHERE coupon_id = '$id'";
		$list = $db->getRow($sql);
		$smarty->assign('list',$list);
		$smarty->display('coupon_edit.html');
	}
	else
	{
		$smarty->display('addpay.htm');
	}

	/* 模板赋值 */
	$smarty->assign('ur_here',          $ur_here);
	$smarty->assign('form_act',         $form_act);
	$smarty->assign('payment_list',     $payment);
	$smarty->assign('action',           $_REQUEST['act']);
	$smarty->assign('user_surplus',     $user_account);
	$smarty->assign('user_name',        $user_name);

	if ($_REQUEST['act'] == 'add')
	{
		$href = 'user_account.php?act=list';
	}
	else
	{
		$href = 'user_account.php?act=list&' . list_link_postfix();
	}
	$smarty->assign('action_link', array('href' => $href, 'text' => $_LANG['09_user_account']));

	assign_query_info();
	$smarty->display('coupon_info.htm');
}

/*------------------------------------------------------ */
//-- 添加/编辑会员余额的处理部分
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'insert' || $_REQUEST['act'] == 'update')
{
	/* 权限判断 */
	admin_priv('surplus_manage');
	include_once ROOT_PATH."/includes/lib_form.php";
	$Form = new class_post();

	/* 初始化变量 */
	$mobile    = $_POST['mobile']  ;
	if(!$Form->fun_mobile($mobile)){
		sys_msg('手机号格式不正确!', 0, $link);
	    return false;
	}
	$card_num    = $_POST['card_num'] ;
	if(!$Form->fun_card_num($card_num)){
		sys_msg('代金券号码不正确!', 0, $link);
		return false;
	}
	$id = $db::escape_string($_POST['id']);
	$operation_id = $_SESSION['admin_id'];
	$pre = substr($card_num,0,2);
	switch ($pre){
		case '10':
			$money = 10000;
			break;
		case '05':
			$money = 5000;
			break;
		case '03':
			$money = 3000;
			break;
		case '01':
			$money = 1000;
			break;
		case 'x5':
			$money = 500;
			break;
		default:
			break;
	}
	$status = $_POST['status'];



	if ($_REQUEST['act'] == 'insert')
	{
		/* 入库的操作 */
		$sql = "select telephone,card_num from " .$ecs->table('coupon').
			"where telephone = $mobile or card_num = '$card_num'";
		$result = $db->getRow($sql);

		if($result){
			sys_msg('手机号或卡号已存在!', 0, $link);
		}
		$sql = "INSERT INTO " .$ecs->table('coupon').
			"(telephone,money,card_num,operation_id) VALUES ( '$mobile', '$money','$card_num', '$operation_id')";
		$db->query($sql);
		$id = $db->insert_id();
	}
	else
	{
		/* 入库的操作 */
		$sql = "select telephone,card_num from " .$ecs->table('coupon').
			"where (telephone = '$mobile' or card_num = '$card_num') and coupon_id != '$id'";
		$result = $db->getRow($sql);

		if($result){
			sys_msg('手机号或卡号已存在!', 0, $link);
		}
		/* 更新数据表 */
		$sql = "UPDATE " .$ecs->table('coupon'). " SET ".
			"money   =    '$money', ".
			"card_num   = '$card_num', ".
			"status   =   '$status', ".
			"telephone   = '$mobile' ".
			"WHERE coupon_id      = '$id'";
		$db->query($sql);
	}


	/* 记录管理员操作 */
	if ($_REQUEST['act'] == 'update')
	{
		admin_log($user_name, 'edit', 'user_surplus');
	}
	else
	{
		admin_log($user_name, 'add', 'user_surplus');
	}

	/* 提示信息 */
	if ($_REQUEST['act'] == 'insert')
	{
		$href = 'coupon.php?act=list';
	}
	else
	{
		$href = 'coupon.php?act=list&' . list_link_postfix();
	}
	$link[0]['text'] = '查看列表';
	$link[0]['href'] = $href;

	$link[1]['text'] = '继续添加';
	$link[1]['href'] = 'coupon.php?act=add';

	sys_msg($_LANG['attradd_succed'], 0, $link);
}

/*------------------------------------------------------ */
//-- 审核会员余额页面
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'check')
{
	/* 检查权限 */
	admin_priv('surplus_manage');

	/* 初始化 */
	$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

	/* 如果参数不合法，返回 */
	if ($id == 0)
	{
		ecs_header("Location: user_account.php?act=list\n");
		exit;
	}

	/* 查询当前的预付款信息 */
	$account = array();
	$account = $db->getRow("SELECT * FROM " .$ecs->table('user_account'). " WHERE id = '$id'");
	$account['add_time'] = local_date($_CFG['time_format'], $account['add_time']);

	//余额类型:预付款，退款申请，购买商品，取消订单
	if ($account['process_type'] == 0)
	{
		$process_type = $_LANG['surplus_type_0'];
	}
	elseif ($account['process_type'] == 1)
	{
		$process_type = $_LANG['surplus_type_1'];
	}
	elseif ($account['process_type'] == 2)
	{
		$process_type = $_LANG['surplus_type_2'];
	}
	else
	{
		$process_type = $_LANG['surplus_type_3'];
	}

	$sql = "SELECT user_name FROM " .$ecs->table('users'). " WHERE user_id = '$account[user_id]'";
	$user_name = $db->getOne($sql);

	/* 模板赋值 */
	$smarty->assign('ur_here',      $_LANG['check']);
	$account['user_note'] = htmlspecialchars($account['user_note']);
	$smarty->assign('surplus',      $account);
	$smarty->assign('process_type', $process_type);
	$smarty->assign('user_name',    $user_name);
	$smarty->assign('id',           $id);
	$smarty->assign('action_link',  array('text' => $_LANG['09_user_account'],
		'href'=>'user_account.php?act=list&' . list_link_postfix()));

	/* 页面显示 */
	assign_query_info();
	$smarty->display('user_account_check.htm');
}

/*------------------------------------------------------ */
//-- 更新会员余额的状态
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'action')
{
	/* 检查权限 */
	admin_priv('surplus_manage');

	/* 初始化 */
	$id         = isset($_POST['id'])         ? intval($_POST['id'])             : 0;
	$is_paid    = isset($_POST['is_paid'])    ? intval($_POST['is_paid'])        : 0;
	$admin_note = isset($_POST['admin_note']) ? trim($_POST['admin_note'])       : '';

	/* 如果参数不合法，返回 */
	if ($id == 0 || empty($admin_note))
	{
		ecs_header("Location: user_account.php?act=list\n");
		exit;
	}

	/* 查询当前的预付款信息 */
	$account = array();
	$account = $db->getRow("SELECT * FROM " .$ecs->table('user_account'). " WHERE id = '$id'");
	$amount  = $account['amount'];

	//如果状态为未确认
	if ($account['is_paid'] == 0)
	{
		//如果是退款申请, 并且已完成,更新此条记录,扣除相应的余额
		if ($is_paid == '1' && $account['process_type'] == '1')
		{
			$user_account = get_user_surplus($account['user_id']);
			$fmt_amount   = str_replace('-', '', $amount);

			//如果扣除的余额多于此会员拥有的余额，提示
			if ($fmt_amount > $user_account)
			{
				$link[] = array('text' => $_LANG['go_back'], 'href'=>'javascript:history.back(-1)');
				sys_msg($_LANG['surplus_amount_error'], 0, $link);
			}

			update_user_account($id, $amount, $admin_note, $is_paid);

			//更新会员余额数量
			log_account_change($account['user_id'], $amount, 0, 0, 0, $_LANG['surplus_type_1'], ACT_DRAWING);
		}
		elseif ($is_paid == '1' && $account['process_type'] == '0')
		{
			//如果是预付款，并且已完成, 更新此条记录，增加相应的余额
			update_user_account($id, $amount, $admin_note, $is_paid);

			//更新会员余额数量
			log_account_change($account['user_id'], $amount, 0, 0, 0, $_LANG['surplus_type_0'], ACT_SAVING);

		}
		elseif ($is_paid == '0')
		{
			/* 否则更新信息 */
			$sql = "UPDATE " .$ecs->table('user_account'). " SET ".
				"admin_user    = '$_SESSION[admin_name]', ".
				"admin_note    = '$admin_note', ".
				"is_paid       = 0 WHERE id = '$id'";
			$db->query($sql);
		}

		/* 记录管理员日志 */
		admin_log('(' . addslashes($_LANG['check']) . ')' . $admin_note, 'edit', 'user_surplus');

		/* 提示信息 */
		$link[0]['text'] = $_LANG['back_list'];
		$link[0]['href'] = 'user_account.php?act=list&' . list_link_postfix();

		sys_msg($_LANG['attradd_succed'], 0, $link);
	}
}

/*------------------------------------------------------ */
//-- ajax帐户信息列表
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'query')
{
	$list = account_list();
	$smarty->assign('list',         $list['list']);
	$smarty->assign('filter',       $list['filter']);
	$smarty->assign('record_count', $list['record_count']);
	$smarty->assign('page_count',   $list['page_count']);

	$sort_flag  = sort_flag($list['filter']);
	$smarty->assign($sort_flag['tag'], $sort_flag['img']);

	make_json_result($smarty->fetch('coupon_list.htm'), '', array('filter' => $list['filter'], 'page_count' => $list['page_count']));
}
/*------------------------------------------------------ */
//-- ajax删除一条信息
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'remove')
{
	/* 检查权限 */
	check_authz_json('surplus_manage');
	$id = @intval($_REQUEST['id']);
	$sql = "SELECT u.user_name FROM " . $ecs->table('users') . " AS u, " .
		$ecs->table('user_account') . " AS ua " .
		" WHERE u.user_id = ua.user_id AND ua.id = '$id' ";
	$user_name = $db->getOne($sql);
	$sql = "DELETE FROM " . $ecs->table('user_account') . " WHERE id = '$id'";
	if ($db->query($sql, 'SILENT'))
	{
		admin_log(addslashes($user_name), 'remove', 'user_surplus');
		$url = 'user_account.php?act=query&' . str_replace('act=remove', '', $_SERVER['QUERY_STRING']);
		ecs_header("Location: $url\n");
		exit;
	}
	else
	{
		make_json_error($db->error());
	}
}

/*------------------------------------------------------ */
//-- 会员余额函数部分
/*------------------------------------------------------ */
/**
 * 查询会员余额的数量
 * @access  public
 * @param   int     $user_id        会员ID
 * @return  int
 */
function get_user_surplus($user_id)
{
	$sql = "SELECT SUM(user_money) FROM " .$GLOBALS['ecs']->table('account_log').
		" WHERE user_id = '$user_id'";

	return $GLOBALS['db']->getOne($sql);
}

/**
 * 更新会员账目明细
 *
 * @access  public
 * @param   array     $id          帐目ID
 * @param   array     $admin_note  管理员描述
 * @param   array     $amount      操作的金额
 * @param   array     $is_paid     是否已完成
 *
 * @return  int
 */
function update_user_account($id, $amount, $admin_note, $is_paid)
{
	$sql = "UPDATE " .$GLOBALS['ecs']->table('user_account'). " SET ".
		"admin_user  = '$_SESSION[admin_name]', ".
		"amount      = '$amount', ".
		"paid_time   = '".gmtime()."', ".
		"admin_note  = '$admin_note', ".
		"is_paid     = '$is_paid' WHERE id = '$id'";
	return $GLOBALS['db']->query($sql);
}

/**
 *
 *
 * @access  public
 * @param
 *
 * @return void
 */
function account_list()
{
	$result = get_filter();
	if ($result === false)
	{
		/* 过滤列表 */
		$filter['user_id'] = !empty($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;
		$filter['keywords'] = empty($_REQUEST['keywords']) ? '' : trim($_REQUEST['keywords']);
		if (isset($_REQUEST['is_ajax']) && $_REQUEST['is_ajax'] == 1)
		{
			$filter['keywords'] = json_str_iconv($filter['keywords']);
		}

		$filter['sort_by'] = empty($_REQUEST['sort_by']) ? 'input_time' : trim($_REQUEST['sort_by']);
		$filter['sort_order'] = empty($_REQUEST['sort_order']) ? 'ASC' : trim($_REQUEST['sort_order']);

		$where = " WHERE 1 ";
		if ($filter['user_id'] > 0)
		{
			$where .= " AND ua.user_id = '$filter[user_id]' ";
		}

		if ($filter['keywords'])
		{
			$where .= " AND u.user_name LIKE '%" . mysql_like_quote($filter['keywords']) . "%'";
			$sql = "SELECT COUNT(*) FROM " .$GLOBALS['ecs']->table('coupon').  $where;
		}


		$sql = "SELECT COUNT(*) FROM " .$GLOBALS['ecs']->table('coupon'). $where;
		$filter['record_count'] = $GLOBALS['db']->getOne($sql);

		/* 分页大小 */
		$filter = page_and_size($filter);

		/* 查询数据 */
		$sql  = 'SELECT *  FROM ' .
			$GLOBALS['ecs']->table('coupon').
			$where . "ORDER by " . $filter['sort_by'] . " " .$filter['sort_order']. " LIMIT ".$filter['start'].", ".$filter['page_size'];

		$filter['keywords'] = stripslashes($filter['keywords']);
		set_filter($filter, $sql);
	}
	else
	{
		$sql    = $result['sql'];
		$filter = $result['filter'];
	}

	$list = $GLOBALS['db']->getAll($sql);

	$arr = array('list' => $list, 'filter' => $filter, 'page_count' => $filter['page_count'], 'record_count' => $filter['record_count']);

	return $arr;
}

?>
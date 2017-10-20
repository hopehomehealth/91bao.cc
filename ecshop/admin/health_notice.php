<?php
/**
 * Created by PhpStorm.
 * User: shusao
 * Date: 2017/6/5
 * Time: 19:18
 */
define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
include_once(ROOT_PATH . 'includes/cls_image.php');
$image = new cls_image($_CFG['bgcolor']);

$exc = new exchange($ecs->table("goods_jkgz"), $db, 'jkgz_id', 'jkgz_key');

/*------------------------------------------------------ */
//-- 品牌列表
/*------------------------------------------------------ */
if ($_REQUEST['act'] == 'list')
{
	$smarty->assign('ur_here',      $_LANG['09_health_notice_list']);
	$smarty->assign('action_link',  array('text' => $_LANG['09_health_add'], 'href' => 'health_notice.php?act=add'));
	$smarty->assign('full_page',    1);

	$combo_list = get_combolist();
	$smarty->assign('combo_list',   $combo_list['combo']);
	$smarty->assign('filter',       $combo_list['filter']);
	$smarty->assign('record_count', $combo_list['record_count']);
	$smarty->assign('page_count',   $combo_list['page_count']);
	assign_query_info();
	$smarty->display('health_list.htm');
}

/*------------------------------------------------------ */
//-- 添加品牌
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'add')
{
	/* 权限判断 */
	admin_priv('brand_manage');

	$smarty->assign('ur_here',    '健康告知');
	$smarty->assign('action_link', array('text' => '健康告知列表', 'href' => 'health_notice.php?act=list'));
	$smarty->assign('form_action', 'insert');
	$smarty->assign('goods_list', getGoodList());
	assign_query_info();
	$smarty->assign('brand', array('sort_order'=>50, 'is_show'=>1));
	$smarty->display('health_info.htm');
}


elseif ($_REQUEST['act'] == 'insert')
{
	/*检查品牌名是否重复*/
	admin_priv('combo_manage');

	$key = $db::escape_string($_POST['health_key']);
	$des = $db::escape_string($_POST['health_desc']);
	$goods_id = $_POST['gid'];
	if(!is_numeric($goods_id)){
		sys_msg('商品id不正确!', 1);
		exit;
	}
	$list_order = $_POST['order'];

	/*插入数据*/
	$sql = "INSERT INTO ".$ecs->table('goods_jkgz')."(goods_id, jkgz_key, jkgz_value,list_order) ".
		"VALUES ('$goods_id','$key', '$des', '$list_order')";
	$db->query($sql);

	admin_log($_POST['combo_name'],'add','combo');

	/* 清除缓存 */
	clear_cache_files();

	$link[0]['text'] = '继续添加';
	$link[0]['href'] = 'health_notice.php?act=add';

	$link[1]['text'] = '返回列表';
	$link[1]['href'] = 'health_notice.php?act=list';

	sys_msg('健康告知添加成功!', 0, $link);
}

/*------------------------------------------------------ */
//-- 编辑品牌
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'edit')
{
	/* 权限判断 */
	admin_priv('brand_manage');
	$sql = "SELECT * ".
		"FROM " .$ecs->table('goods_jkgz'). " WHERE jkgz_id='$_REQUEST[id]'";
	$combo = $db->GetRow($sql);
	$smarty->assign('goods_list', getGoodList());
	$smarty->assign('ur_here',     $_LANG['brand_edit']);
	$smarty->assign('action_link', array('text' => $_LANG['07_goods_combo_list'], 'href' => 'combo.php?act=list&' . list_link_postfix()));
	$smarty->assign('combo',       $combo);

	$smarty->assign('form_action', 'update');

	assign_query_info();
	$smarty->display('health_info.htm');
}
elseif ($_REQUEST['act'] == 'update')
{
	admin_priv('brand_manage');

	$key = $db::escape_string($_POST['health_key']);
	$des = $db::escape_string($_POST['health_desc']);
	$goods_id = $_POST['gid'];
	if(!is_numeric($goods_id)){
		sys_msg('商品id不正确!', 1);
		exit;
	}
	$list_order = $_POST['order'];

	$param = " goods_id = '$goods_id', jkgz_key='$key',  jkgz_value='$des', list_order='$list_order' ";
	if ($exc->edit($param,  $_POST['id']))
	{
		/* 清除缓存 */
		clear_cache_files();

		admin_log($_POST['combo_desc'], 'edit', 'combo');

		$link[0]['text'] = '返回告知列表';
		$link[0]['href'] = 'health_notice.php?act=list&' . list_link_postfix();
		sys_msg('修改成功!', 0, $link);
	}
	else
	{
		die($db->error());
	}
}

/*------------------------------------------------------ */
//-- 编辑品牌名称
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'edit_brand_name')
{
	check_authz_json('brand_manage');

	$id     = intval($_POST['id']);
	$name   = json_str_iconv(trim($_POST['val']));

	/* 检查名称是否重复 */
	if ($exc->num("brand_name",$name, $id) != 0)
	{
		make_json_error(sprintf($_LANG['brandname_exist'], $name));
	}
	else
	{
		if ($exc->edit("brand_name = '$name'", $id))
		{
			admin_log($name,'edit','brand');
			make_json_result(stripslashes($name));
		}
		else
		{
			make_json_result(sprintf($_LANG['brandedit_fail'], $name));
		}
	}
}

elseif($_REQUEST['act'] == 'add_brand')
{
	$brand = empty($_REQUEST['brand']) ? '' : json_str_iconv(trim($_REQUEST['brand']));

	if(brand_exists($brand))
	{
		make_json_error($_LANG['brand_name_exist']);
	}
	else
	{
		$sql = "INSERT INTO " . $ecs->table('brand') . "(brand_name)" .
			"VALUES ( '$brand')";

		$db->query($sql);
		$brand_id = $db->insert_id();

		$arr = array("id"=>$brand_id, "brand"=>$brand);

		make_json_result($arr);
	}
}
/*------------------------------------------------------ */
//-- 编辑排序序号
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'edit_sort_order')
{
	check_authz_json('brand_manage');

	$id     = intval($_POST['id']);
	$order  = intval($_POST['val']);
	$name   = $exc->get_name($id);

	if ($exc->edit("sort_order = '$order'", $id))
	{
		admin_log(addslashes($name),'edit','brand');

		make_json_result($order);
	}
	else
	{
		make_json_error(sprintf($_LANG['brandedit_fail'], $name));
	}
}

/*------------------------------------------------------ */
//-- 切换是否显示
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'toggle_show')
{
	check_authz_json('brand_manage');

	$id     = intval($_POST['id']);
	$val    = intval($_POST['val']);

	$exc->edit("is_show='$val'", $id);

	make_json_result($val);
}

/*------------------------------------------------------ */
//-- 删除品牌
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'remove')
{
	check_authz_json('brand_manage');

	$id = intval($_GET['id']);

	$exc->drop($id);

	$url = 'health_notice.php?act=query&' . str_replace('act=remove', '', $_SERVER['QUERY_STRING']);

	ecs_header("Location: $url\n");
	exit;
}

/*------------------------------------------------------ */
//-- 排序、分页、查询
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'query')
{
	$brand_list = get_combolist();
	$smarty->assign('combo_list',   $brand_list['combo']);
	$smarty->assign('filter',       $brand_list['filter']);
	$smarty->assign('record_count', $brand_list['record_count']);
	$smarty->assign('page_count',   $brand_list['page_count']);

	make_json_result($smarty->fetch('health_list.htm'), '',
		array('filter' => $brand_list['filter'], 'page_count' => $brand_list['page_count']));
}

/**
 * 获取套餐列表
 *
 * @access  public
 * @return  array
 */
function get_combolist()
{
	$result = get_filter();
	if ($result === false)
	{
		/* 分页大小 */
		$filter = array();

		/* 记录总数以及页数 */
		if (isset($_POST['combo_name']))
		{
			$sql = "SELECT COUNT(*) FROM ".$GLOBALS['ecs']->table('goods_jkgz') .' WHERE brand_name = \''.$_POST['brand_name'].'\'';
		}
		else
		{
			$sql = "SELECT COUNT(*) FROM ".$GLOBALS['ecs']->table('goods_jkgz');
		}

		$filter['record_count'] = $GLOBALS['db']->getOne($sql);

		$filter = page_and_size($filter);

		/* 查询记录 */
		if (isset($_POST['goods_jkgz_name']))
		{
			if(strtoupper(EC_CHARSET) == 'GBK')
			{
				$keyword = iconv("UTF-8", "gb2312", $_POST['combo_name']);
			}
			else
			{
				$keyword = $_POST['goods_jkgz_name'];
			}
			$sql = "SELECT t1.*,t2.goods_name FROM ".$GLOBALS['ecs']->table('goods_jkgz')." left join ".$GLOBALS['ecs']->table('goods')." on
             t1.gid = t2.goods_id WHERE goods_jkgz_name like '%{$keyword}%' ORDER BY sort_order ASC";
		}
		else
		{
			$sql = "SELECT t1.*,t2.goods_name FROM ".$GLOBALS['ecs']->table('goods_jkgz')." t1 left join ".$GLOBALS['ecs']->table('goods')." t2 on
             t1.goods_id = t2.goods_id
             
            ORDER BY  t2.goods_name ASC ,t1.list_order asc ";
		}

		set_filter($filter, $sql);
	}
	else
	{
		$sql    = $result['sql'];
		$filter = $result['filter'];
	}
	$res = $GLOBALS['db']->selectLimit($sql, $filter['page_size'], $filter['start']);

	$arr = array();
	while ($rows = $GLOBALS['db']->fetchRow($res))
	{
		$brand_logo = empty($rows['brand_logo']) ? '' :
			'<a href="../' . DATA_DIR . '/brandlogo/'.$rows['brand_logo'].'" target="_brank"><img src="images/picflag.gif" width="16" height="16" border="0" alt='.$GLOBALS['_LANG']['brand_logo'].' /></a>';
		$site_url   = empty($rows['site_url']) ? 'N/A' : '<a href="'.$rows['site_url'].'" target="_brank">'.$rows['site_url'].'</a>';


		$arr[] = $rows;
	}

	return array('combo' => $arr, 'filter' => $filter, 'page_count' => $filter['page_count'], 'record_count' => $filter['record_count']);
}

function getGoodList(){
	$sql = "select goods_id, goods_name from ".$GLOBALS['ecs']->table('goods');
	$goods_res = $GLOBALS['db']->getAll($sql);
	return $goods_res;
}
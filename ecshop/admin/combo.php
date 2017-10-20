<?php

/**
 * ECSHOP 管理中心套餐管理
 * ============================================================================
 * * 版权所有 2005-2012 上海商派网络科技有限公司，并保留所有权利。
 * 网站地址: http://91bao.cc；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和
 * 使用；不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * $Author: liubo $
 * $Id: brand.php 17217 2011-01-19 06:29:08Z liubo $
*/

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
include_once(ROOT_PATH . 'includes/cls_image.php');
$image = new cls_image($_CFG['bgcolor']);

$exc = new exchange($ecs->table("combo"), $db, 'id', 'combo_name');

/*------------------------------------------------------ */
//-- 品牌列表
/*------------------------------------------------------ */
if ($_REQUEST['act'] == 'list')
{
    $smarty->assign('ur_here',      $_LANG['07_goods_combo_list']);
    $smarty->assign('action_link',  array('text' => $_LANG['07_combo_add'], 'href' => 'combo.php?act=add'));
    $smarty->assign('full_page',    1);

    $combo_list = get_combolist();

	foreach ($combo_list['combo']  as $k => $item) {
		$combo_list['combo'][$k]['content'] = json_decode($item['content'],true);
	}
    $smarty->assign('combo_list',   $combo_list['combo']);
    $smarty->assign('filter',       $combo_list['filter']);
    $smarty->assign('record_count', $combo_list['record_count']);
    $smarty->assign('page_count',   $combo_list['page_count']);
    assign_query_info();
    $smarty->display('combo_list.htm');
}

/*------------------------------------------------------ */
//-- 添加品牌
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'add')
{
    /* 权限判断 */
    admin_priv('brand_manage');

    $smarty->assign('ur_here',     $_LANG['07_brand_add']);
    $smarty->assign('action_link', array('text' => $_LANG['07_goods_combo_list'], 'href' => 'combo.php?act=list'));
    $smarty->assign('form_action', 'insert');
    $smarty->assign('goods_list', getGoodList());
    assign_query_info();
    $smarty->assign('brand', array('sort_order'=>50, 'is_show'=>1));
    $smarty->display('combo_info.htm');
}
elseif ($_REQUEST['act'] == 'insert')
{
    /*检查品牌名是否重复*/
    admin_priv('combo_manage');
    
    if(!is_numeric($_POST['combo_price']) && !empty($_POST['combo_price'])){
           sys_msg('价格必须为数字!',1);
    }    
    

    $is_show = isset($_REQUEST['is_show']) ? 1 : 0;

//    $is_only = $exc->is_only('combo_name', $_POST['combo_name']);
//
//    if (!$is_only)
//    {
//        sys_msg('套餐名已存在!', 1);
//    }
    /*对描述处理*/
    foreach ($_POST['key'] as $k => $v){
		if($v == ''){
			continue;
		}
        $arr[$k]['key'] = $v;
        $arr[$k]['value'] = $_POST['value'][$k];
        $arr[$k]['desc'] = $_POST['desc'][$k];
    }
    $comboDesc = json_encode($arr,JSON_UNESCAPED_UNICODE);

    $description = $db::escape_string($_POST['combo_desc']);

 	$price = $_POST['combo_price']?$_POST['combo_price']:'0';
     /*处理图片*/
//    $img_name = basename($image->upload_image($_FILES['brand_logo'],'brandlogo'));

     /*处理URL*/
    $combo_name = $db::escape_string( $_POST['combo_name']);
    $time = time();
    /*插入数据*/
    $sql = "INSERT INTO ".$ecs->table('combo')."(gid, goods_id, combo_name, price, content, description, is_show, sort_order,inputtime,updatetime) ".
           "VALUES ('$_POST[gid]', '$_POST[goods_id]', '$combo_name', $price, '$comboDesc', '$description', '$is_show', '$_POST[sort_order]',$time,$time)";
    $db->query($sql);

    admin_log($_POST['combo_name'],'add','combo');

    /* 清除缓存 */
    clear_cache_files();

    $link[0]['text'] = "继续添加";
    $link[0]['href'] = 'combo.php?act=add';

    $link[1]['text'] = "返回列表";
    $link[1]['href'] = 'combo.php?act=list';

    sys_msg('套餐添加成功!', 0, $link);
}

/*------------------------------------------------------ */
//-- 编辑品牌
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'edit')
{
    /* 权限判断 */
    admin_priv('brand_manage');
    $sql = "SELECT * ".
            "FROM " .$ecs->table('combo'). " WHERE id='$_REQUEST[id]'";
    $combo = $db->GetRow($sql);
    $combo['content'] = json_decode($combo['content'],true);
	$smarty->assign('goods_list', getGoodList());
    $smarty->assign('ur_here',     $_LANG['brand_edit']);
    $smarty->assign('action_link', array('text' => $_LANG['07_goods_combo_list'], 'href' => 'combo.php?act=list&' . list_link_postfix()));
    $smarty->assign('combo',       $combo);

    $smarty->assign('form_action', 'update');

    assign_query_info();
    $smarty->display('combo_info.htm');
}
elseif ($_REQUEST['act'] == 'update')
{
    admin_priv('brand_manage');
    if ($_POST['brand_name'] != $_POST['old_brandname'])
    {
        /*检查品牌名是否相同*/
        $is_only = $exc->is_only('brand_name', $_POST['brand_name'], $_POST['id']);

        if (!$is_only)
        {
            sys_msg(sprintf($_LANG['brandname_exist'], stripslashes($_POST['brand_name'])), 1);
        }
    }

    /*对描述处理*/
		foreach ($_POST['key'] as $k => $v){
		    if($v == ''){
		        continue;
		    }
			$arr[$k]['key'] = $v;
			$arr[$k]['value'] = $_POST['value'][$k];
			$arr[$k]['desc'] = $_POST['desc'][$k];
		}
		$comboDesc = json_encode($arr,JSON_UNESCAPED_UNICODE);

		$desc = $_POST['combo_desc'];

    $time = time();
	$price = $_POST['combo_price']?$_POST['combo_price']:'0';
    $is_show = isset($_REQUEST['is_show']) ? intval($_REQUEST['is_show']) : 0;
    $param = " gid = '$_POST[gid]',combo_name = '$_POST[combo_name]', price=$price, description='$desc',  content='$comboDesc', is_show='$is_show', sort_order='$_POST[sort_order]' ,updatetime='$time' ,goods_id='$_POST[goods_id]' ";
    if ($exc->edit($param,  $_POST['id']))
    {
        /* 清除缓存 */
        clear_cache_files();

        admin_log($_POST['combo_desc'], 'edit', 'combo');

        $link[0]['text'] = "返回列表";
        $link[0]['href'] = 'combo.php?act=list&' . list_link_postfix();
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

    /* 删除该品牌的图标 */
    $sql = "SELECT brand_logo FROM " .$ecs->table('brand'). " WHERE brand_id = '$id'";
    $logo_name = $db->getOne($sql);
    if (!empty($logo_name))
    {
        @unlink(ROOT_PATH . DATA_DIR . '/brandlogo/' .$logo_name);
    }

    $exc->drop($id);

    /* 更新商品的品牌编号 */
    $sql = "UPDATE " .$ecs->table('goods'). " SET brand_id=0 WHERE brand_id='$id'";
    $db->query($sql);

    $url = 'combo.php?act=query&' . str_replace('act=remove', '', $_SERVER['QUERY_STRING']);

    ecs_header("Location: $url\n");
    exit;
}

/*------------------------------------------------------ */
//-- 删除品牌图片
/*------------------------------------------------------ */
elseif ($_REQUEST['act'] == 'drop_logo')
{
    /* 权限判断 */
    admin_priv('brand_manage');
    $brand_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    /* 取得logo名称 */
    $sql = "SELECT brand_logo FROM " .$ecs->table('brand'). " WHERE brand_id = '$brand_id'";
    $logo_name = $db->getOne($sql);

    if (!empty($logo_name))
    {
        @unlink(ROOT_PATH . DATA_DIR . '/brandlogo/' .$logo_name);
        $sql = "UPDATE " .$ecs->table('brand'). " SET brand_logo = '' WHERE brand_id = '$brand_id'";
        $db->query($sql);
    }
    $link= array(array('text' => $_LANG['brand_edit_lnk'], 'href' => 'brand.php?act=edit&id=' . $brand_id), array('text' => $_LANG['brand_list_lnk'], 'href' => 'brand.php?act=list'));
    sys_msg($_LANG['drop_brand_logo_success'], 0, $link);
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

    make_json_result($smarty->fetch('combo_list.htm'), '',
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
            $sql = "SELECT COUNT(*) FROM ".$GLOBALS['ecs']->table('combo') .' WHERE brand_name = \''.$_POST['brand_name'].'\'';
        }
        else
        {
            $sql = "SELECT COUNT(*) FROM ".$GLOBALS['ecs']->table('combo');
        }

        $filter['record_count'] = $GLOBALS['db']->getOne($sql);

        $filter = page_and_size($filter);

        /* 查询记录 */
        if (isset($_POST['combo_name']))
        {
            if(strtoupper(EC_CHARSET) == 'GBK')
            {
                $keyword = iconv("UTF-8", "gb2312", $_POST['combo_name']);
            }
            else
            {
                $keyword = $_POST['combo_name'];
            }
            $sql = "SELECT t1.*,t2.goods_name FROM ".$GLOBALS['ecs']->table('combo')." left join ".$GLOBALS['ecs']->table('goods')." on
             t1.gid = t2.goods_id WHERE combo_name like '%{$keyword}%' ORDER BY sort_order ASC";
        }
        else
        {
            $sql = "SELECT t1.*,t2.goods_name FROM ".$GLOBALS['ecs']->table('combo')." t1 left join ".$GLOBALS['ecs']->table('goods')." t2 on
             t1.gid = t2.goods_id
             
             ORDER BY t2.goods_name ASC";
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

?>

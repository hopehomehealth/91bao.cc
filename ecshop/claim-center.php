<?php
define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

if ((DEBUG_MODE & 2) != 2)
{
	$smarty->caching = true;
}

/*------------------------------------------------------ */
//-- INPUT
/*------------------------------------------------------ */

/* 获得请求的分类 ID */


if (empty($brand_id))
{
	/* 缓存编号 */
	$cache_id = sprintf('%X', crc32($_CFG['lang'].'claim-center'));
	if (!$smarty->is_cached('claim-center.dwt', $cache_id))
	{
		assign_template();
		$url = $_SERVER['REQUEST_URI'];
		$smarty->assign('url',$url);
		$position = assign_ur_here('', $_LANG['all_brand']);
		$smarty->assign('page_title',      '理赔中心');    // 页面标题
		$smarty->assign('ur_here',         $position['ur_here']);  // 当前位置

		$smarty->assign('categories',      get_categories_tree()); // 分类树
		$smarty->assign('helps',           get_shop_help());       // 网店帮助
		$smarty->assign('top_goods',       get_top10());           // 销售排行

	}
	$smarty->display('claim-center.dwt');
	exit();
}
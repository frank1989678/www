<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>js_ajax</title>
	<link rel="stylesheet" href="/static/css/layout.css" />
	<link rel="stylesheet" href="css/form.css" />
	<script src="/static/js/jquery191.js"></script>
	<script src="/static/js/city.js"></script>
	<script src="js/name.js"></script>
	<script src="js/dialog.js"></script>
	<script src="js/js_ajax.js"></script>
</head>
<body>

<div class="wrap">
	<div class="tab">
		<span class="tab_btn curr">添加数据</span>
		<a class="tab_btn" href="json.html">同域加载</a>
		<a class="tab_btn" href="jsonp.html">跨域加载</a>
		<span class="tab_btn">添加姓氏</span>
		<span class="tab_btn">添加人名</span>
	</div>

	<div class="tabcontWrap mt20">
		<div class="tabcont clearfix curr">
			<div class="l w320">
				<h2 class="f14 blue">添加数据</h2>
				<form action="add.php" method="post" class="form mt20" id="myform" name="myform">
					<div class="item">
						<label>姓名：</label> 
						<input class="ipt" type="text" name="name" id="name" value="">
						<span></span>
					</div>
					<div class="item">
						<label>手机：</label> 
						<input class="ipt" type="text" name="tel" id="tel" value="">
						<span></span>
					</div>
					<div class="item">
						<label>籍贯：</label> 
						<input class="ipt" type="text" name="address" id="address" value="">
						<span></span>
					</div>
					<div class="item">
						<label>生辰：</label> 
						<input class="ipt" type="text" name="birthday" id="birthday" value="">
						<span></span>
					</div>
					<div class="item">
						<label>&nbsp;</label>
						<input type="button" class="w100 btn white bg-olive" value="随机" name="random" id="random"  />
						<input type="button" class="w100 btn white bg-blue" value="提交表单" name="sub" id="sub"  />
						<span class="msg"></span>
					</div>
				</form> 
			</div>
			<div class="l w700">
				<h2 class="f14 blue">显示数据</h2>
				<table class="mt20 pct100 tc list">
					<tbody>
						<tr class="tit">
							<td class="tl">姓名</td>
							<td>电话</td>
							<td>生日</td>
							<td class="tr">地址</td>
							<td>操作</td>
						</tr>	
						<?php
						include("php/conn.php");//引入链接数据库
						$perNumber = 10;
						$url = 'http://localhost/develop/js_ajax/default.php';
						$c   = "SELECT count(*) FROM member";
						$count = mysql_query($c, $conn);
						$rs				=	mysql_fetch_array($count); 
						$totalNumber	=	$rs[0];
						$totalPage		=	ceil($totalNumber/$perNumber); //计算出总页数
						$showPage = 5;
						if (is_array($_GET) && count($_GET) > 0 && isset($_GET["page"])) {
							$page = $_GET["page"];
							if ($page > $totalPage) {
								header("Location:".$url);
							}
						} else {
							$page = 1;
						}
						$startCount = ($page-1)*$perNumber;
						$q 	= "SELECT * FROM member order by iid desc limit $startCount,$perNumber";
						
						$rs = mysql_query($q, $conn);
						while($row = mysql_fetch_array($rs)) echo "<tr><td class=\"tl\">$row[name]</td><td>$row[tel]</td><td>$row[birthday]</td><td class=\"tr\">$row[address]</td><td><a data-iid=\"$row[iid]\" href=\"javascript:\" class=\"blue del\">删除</a></td></tr>";
						mysql_close(); 
						?>	
					</tbody>
				</table>
				<div class="page mt10">
					<?php
					include("php/conn.php");
					$first = $page > $showPage ? $page - $showPage : 1;
					$last = $totalPage > ($page + $showPage) ? $page + $showPage : $totalPage; 
					//echo '<span class="page_btn info">'.$page.'/'.$totalPage.'</span>';
					if ($page == 1) {
						echo '<span class="page_btn disabled">首页</span><span class="page_btn disabled">上一页</span>';
					} else {
						echo '<a class="page_btn" href="'.$url.'?page=1">首页</a><a class="page_btn" href="'.$url.'?page='.($page - 1).'">上一页</a>';
					}
					if ($first != 1) {
						echo '<span class="page_btn more">...</span>';
					}
					for( ; $first <= $last; $first++){
						if ($first == $page) {
							echo '<span class="page_btn curr">'.$first.'</span>';
						} else {
							echo '<a class="page_btn" href="'.$url.'?page='.$first.'">'.$first.'</a>';
						}
					}
					if ($page < $totalPage - $showPage) {
						echo '<span class="page_btn more">...</span>';
					}
					if ($page < $totalPage) {
						echo '<a class="page_btn" href="'.$url.'?page='.($page + 1).'">下一页</a><a class="page_btn" href="'.$url.'?page='.$totalPage.'">末页</a>';
					} else {
						echo '<span class="page_btn disabled">下一页</span><span class="page_btn disabled">末页</span>';
					}
					?>
				</div>
			</div>
		</div>
		<div class="tabcont"></div>
		<div class="tabcont"></div>
		<div class="tabcont">
			<h2 class="f14 blue">添加姓氏</h2>
			<form action="surname.php" method="post" class="form mt20" id="myform4" name="myform4">
				<div class="item">
					<label>姓氏：</label> 
					<input class="ipt" type="text" name="name" value="">
					<span></span>
				</div>
				<div class="item">
					<label>&nbsp;</label>
					<input type="button" class="w100 btn white bg-blue" value="提交表单" name="sub4" id="sub4"  />
					<span class="msg"></span>
				</div>
			</form> 
		</div>
		<div class="tabcont">
			<h2 class="f14 blue">添加人名</h2>
			<form action="name.php" method="post" class="form mt20" id="myform5" name="myform5">
				<div class="item">
					<label>名字：</label> 
					<input class="ipt" type="text" name="name" value="">
					<span></span>
				</div>
				<div class="item">
					<label>&nbsp;</label>
					<input type="button" class="w100 btn white bg-blue" value="提交表单" name="sub5" id="sub5"  />
					<span class="msg"></span>
				</div>
			</form> 
		</div>
	</div>

</div>


</body>
</html>
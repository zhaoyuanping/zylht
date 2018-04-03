$(function(){
	var ue = UM.getEditor('container');
	ue.setHeight(250);
	ue.setWidth(830);
	var IURL = 'http://localhost:9988/images/';
	$('#dg').datagrid({
		singleSelect:true,
		url:'../notice/list.do',  
		method:'get',
		queryParams: {
			pageSize: 10
		},
		loadFilter: function(data){
			if(data.datas.length > 0){
				return data.datas
			}
			else{
				return data;
			}
		},
		columns:[[    
		          {field:'id',title:'id',hidden:true}, 
		          {field:'title',title:'标题',width:120,align:'center'},    
//		          {field:'content',title:'内容',width:150},    
		          {field:'image',title:'公告首页展示图',width:100,align:'center',formatter:function(value,row,index){
		        	  return '<a class="bacimg" data-id='+row.id+' data-img='+row.image+' href="javascript:;" style="text-decoration: none;">点击查看</a>';
		          }}, 
		          {field:'userId',title:'创建用户',width:100,align:'center'} ,
		          {field:'status',title:'顶置状态',width:100,align:'center',order:'desc',formatter:function(value,row,index){
		        	  return value == 1?'顶置':'普通';
		          },styler:function(value,row,index){
		        	  if (value == 1){
		        		  return 'color:red;';
		        	  }
		          }},   
		          {field:'createTime',title:'创建时间',width:120,formatter:function(value,row,index){

		        	  return value;
		          }},  
		          {field:'cz',title:'操作',width:120,align:'center',formatter:function(value,row,index){
		        	  return '<a class="upnotice" data-id='+row.id+' href="javascript:;" style="text-decoration: none;">顶置</a> | '+
		        	  '<a class="updatanotice" data-id='+row.id+' href="javascript:;" style="text-decoration: none;">修改</a> | <a class="delnotice" data-id='+row.id+' href="javascript:;" style="text-decoration: none;">删除</a>';
		          }}
		          ]],
		          toolbar: [{
		        	  iconCls: 'icon-add',
		        	  text:'新增公告',
		        	  border:true,
		        	  handler: function(){
		        		  $('#upbackimg').show();
		        		  $('#win').window({   
		        			  	title:'新增公告',
		        			    width:880,    
		        			    height:570,    
		        			    modal:true,
		        			    collapsible:false,
		        			    minimizable:false,
	        			    	maximizable:false
		        			});  
		        		  $('#win').window('open');

		        	  }
		          }],
		          onLoadSuccess:function(data){
		        	  $('.bacimg').click(function(){
		        		  var id = $(this).attr('data-id');
		        		  $('#_id').attr('value',id);
		        		  $('#imgwin').window({   
		        			  title:'公告首页展示图',
		        			  width:500,    
		        			  height:350,    
		        			  modal:true,
		        			  collapsible:false,
		        			  minimizable:false,
		        			  maximizable:false
		        		  });  
		        		  $('#bgimg').attr('src',IURL+$(this).attr('data-img')+'?'+Math.random());
		        		  $('#imgwin').window('open');
		        		  $('#imgsubbut_').click(function(){
		        			  $('#iff').form('submit', {    
		        				  url:'../notice/update.do',   
		        				  success:function(data){   
		        					  $('#dg').datagrid('reload');
		        					  $('#imgwin').window('close');
		        					  var d = JSON.parse(data)
		        					  $.messager.alert('提示', d.msg); 
		        				  }    
		        			  });
		        		  });
		        	  });
		        	  $('.upnotice').click(function(){
		        		  $.post('../notice/updateStatus.do',{status:1,id:$(this).attr('data-id')},function(d){
		        			  $('#dg').datagrid('reload');
		        			  $.messager.alert('提示',d.msg); 
		        		  });
		        	  });
		        	  $('.updatanotice').click(function(){
		        		  $('#upbackimg').hide();
		        		  $('#win').window({   
		        			  	title:'修改公告',
		        			    width:880,    
		        			    height:570,    
		        			    modal:true,
		        			    collapsible:false,
		        			    minimizable:false,
	        			    	maximizable:false
		        			});  
		        		  $('#win').window('open');
		        		  $.get('../notice/getNoticeById.do',{id:$(this).attr('data-id')},function(d){
		        			  if(d.rst){
		        				  $('#title').textbox('setValue',d.msg.title);
		        				  $('#n-status').combobox('setValue', d.msg.status);
		        			  }
		        		  });
//		        		  $.post('notice/update.do',{status:1,id:$(this).attr('data-id')},function(d){
//		        		  $.messager.alert('提示',d.msg); 
//		        		  });
//		        		  alert();
		        	  });
		        	  $('.delnotice').click(function(){
		        		  var _this = $(this);
		        		  $.messager.confirm('确认','您确认想要删除记录吗？',function(r){    
		        			  if (r){    
		        				  $.post('../notice/delete.do',{id:_this.attr('data-id')},function(d){
		        					  $('#dg').datagrid('reload');
		        					  $.messager.alert('提示',d.msg); 
		        				  });   
		        			  }    
		        		  }); 
		        	  });
		          }
		});  
	//提交事件
	$('#submit').bind('click', function(){    
		$('#ff').form('submit', {    
		    url:'../notice/update.do',   
		    onSubmit: function(param){    
		        param.content = ue.getContent();    
		    },
		    success:function(data){    
		    	$('#dg').datagrid('reload');
		    	$('#win').window('close');
		    	var d = JSON.parse(data)
		    	$.messager.alert('提示', d.msg); 
		    }    
		}); 
    });  
	//window关闭
	$('#cancel').bind('click', function(){    
		$('#win').close();
   });    

});
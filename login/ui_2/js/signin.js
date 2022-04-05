$(function () {
	
    /*blur后 data-placeholder不下移*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
	
    /*验证加存储数据*/
    var input = $('.validate-input .input100');
	
   $('.validate-form').on('submit',function(){
        check=true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
			
        }
		/*if(check==true)
		{
		
			tel=$("#tel").val().trim();
			email=$("#email").val().trim();
			pass=$("#pass").val().trim();
			$.ajax({
					url:"http://10.96.128.67/inserdata.php",
					data: {"tel":tel,"email":email, "pass":pass},
					type:"POST",
					dataType:"json"
				});
			alert("注册成功！请登陆")
		}*/
        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });
	
	
	/*验证电话及密码格式*/
    function validate (input) {
           if($(input).attr('type') == 'tel' || $(input).attr('name') == 'tel') {
               if($(input).val().trim().match(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/) == null) {
                   return false;
               }
           }
		   
		   if($(input).attr('type') == 'password' || $(input).attr('name') == 'pass') {
		       if($(input).val().trim().match(/^[\w_-]{6,16}$/) == null) {
		           return false;
		       }
		   }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
    
	/*正则验证电话号码*/
	
	function te(){
			$(".validate-form #tel").each(function () {
		        	alert($(this).val());
		        });
		}

	
  /* sqilte数据库操作
	var db = openDatabase('BLOG','1.0','Blog info',1024*100);
	//创建表
	createTable(db);
	//插入数据
	$("#signin").click(function(){
		tel=$("#tel").val().trim();
		email=$("#email").val().trim();
		pass=$("#pass").val().trim();
		insertData(db,tel,email,pass)
	});
	
	function insertData(db,tel,email,pass){//保存数据
			    db.transaction(function(tx){
			        tx.executeSql('insert into INFO values(?,?,?)',[tel,email,pass],function(tx,rs){
			            alert('插入成功');
			        },
			        function (tx,err){
			            alert("插入失败："+err.source +'**'+err.message);
			        })
			    })
			}
			
	function createTable(db){
				db.transaction(function (tx){
			       tx.executeSql('create table if not exists INFO(TEL TEXT,EMAIL TEXT,PASS TEXT)',[],function(tx,res){
					   alert("表创建成功")
			    },function(tx,err){
			        alert(err.message)
			       });
			   })
			}
	*/		
	
	
});



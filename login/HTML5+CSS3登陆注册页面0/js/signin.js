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
	
    /*验证*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
		/*if(check==true)
		{
	
			telEmail=$("#telEmail").val().trim();
			pass=$("#pass").val().trim();
			$.ajax({
				url:"http://10.96.128.67/inserdata.php",
				data: {"telEmail":telEmail, "pass":pass},
				type:"POST",
				dataType:"json",
				success:function(data){
						//强制转JSon为字符串
						telmeg=JSON.stringify(data);						alert(telmeg);
					},
				error:function () {
					
					
					//alert(响应出错);
					
					
					);
				}
			});
		}
		*/
	   
       return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'text' || $(input).attr('name') == 'tel') {
          if($(input).val().trim().match(/(^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$)|(^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$)/) == null) {
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
    

	
});

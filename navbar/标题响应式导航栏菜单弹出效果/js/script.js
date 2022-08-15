$('.toggle').on('click', function() {
  $('.menu').toggleClass('expanded');  
  $('span').toggleClass('hidden');  
  $('.container , .toggle').toggleClass('close');  
});
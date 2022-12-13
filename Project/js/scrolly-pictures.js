
$(window).on("scroll touchmove", function() 
{
	// if ($(document).scrollTop() >= $("#one").position().top && $(document).scrollTop() < $("#two").position().top  ) 
	// {
	// 	$('body').css('background-image', 'url(https://i.pinimg.com/originals/6d/ff/7e/6dff7e1c2d76c84e359bd3e2b4e3e9e7.jpg)')
    // };
	// if ($(document).scrollTop() >= $("#two").position().top && $(document).scrollTop() < $("#three").position().top)
	// {
	// 	$('body').css('background-image', 'url(https://www.mapc.org/wp-content/uploads/bb-plugin/cache/DSC_0033-panorama.jpg)')
    // };
   if ($(document).scrollTop() >= $("#three").position().top ) 
   {
		$('body').css('background-image', 'url(../img/bg-3.jpg)')
   };
  
});
{% if content.id contains "category-page-popular" %}
<script>
function addSliderToSiteContent() {
    var clerkSlider = document.querySelector('#category-page-popular');
    var siteContent = document.querySelector('.site-content');

    if (!clerkSlider || !siteContent) {
        console.log('Either the slider or site-content element was not found.');
        return;
    }

    siteContent.appendChild(clerkSlider);
}

addSliderToSiteContent();
</script>
<style>
#category-page-popular {
    display: block;
    margin-left:auto;
    margin-right:auto;
    margin-top: 20px;
    width:300px;
    padding-left:10px;
    padding-right:10px
}
@media (min-width:768px) {
    #category-page-popular {
        width:748px;
        padding-left:10px;
        padding-right:10px
    }
}
@media (min-width:960px) {
    #category-page-popular {
        width:940px;
        padding-left:10px;
        padding-right:10px
    }
}
@media (min-width:1280px) {
    #category-page-popular {
        width:1260px;
        padding-left:10px;
        padding-right:10px
    }
}
</style>
{% endif %}
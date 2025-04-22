setTimeout(() => {
    var facetsHolder = document.querySelector('.clerk-facet-categories');
    var categoriesList = facetsHolder ? facetsHolder.querySelector('.clerk-facet-group-facets') : null;
    var facetHolder = categoriesList ? categoriesList.querySelectorAll('.clerk-facet') : null;
    
    if (!facetsHolder || !categoriesList || !facetHolder || facetHolder.length === 0) {
        return;
    }
    
    facetHolder.forEach(el => {
        var facetName = el.querySelector('.clerk-facet-name').innerText.trim();
        var words = facetName.split(' ');
    
        var hasUppercaseWord = words.some(word => word === word.toUpperCase() && word.length > 0);
        
        if (hasUppercaseWord) {
            el.style.display = "none";
        }
    });
}, "200");
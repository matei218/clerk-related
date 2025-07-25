var container = document.querySelector('.clerk-live-search-background.search.results__container');

function hasSelectedClass(element) {
    return element.classList.contains('clerk-instant-search-key-selected');
}

function getLink(element) {
    var linkElement = element.querySelector('a');
    if (!linkElement) return null;
    return linkElement.href;
}

var observerCallback = function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;

        var targetElement = mutation.target;
        if (hasSelectedClass(targetElement)) {
            var link = getLink(targetElement);
            if (link) {
                targetElement.dataset.targetLink = link;
            }
        } else {
            delete targetElement.dataset.targetLink;
        }
    });
};

var observer = new MutationObserver(observerCallback);

container.querySelectorAll('.clerk-design-component-utT7AO99').forEach(function(element) {
    observer.observe(element, { attributes: true, attributeFilter: ['class'] });
});

document.addEventListener('keydown', function(event) {
    if (event.key !== 'Enter') return;

    var targetElement = [...container.querySelectorAll('.clerk-design-component-utT7AO99')]
        .find(function(el) { return hasSelectedClass(el); });

    if (!targetElement) {
        console.log("No selected element found.");
        return;
    }

    var targetLink = getLink(targetElement);
    if (!targetLink) {
        console.log("No link found in the selected element.");
        return;
    }

    window.location.href = targetLink;
}, true);

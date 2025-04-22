function coundRegistrations(){
    const cardsHolder = document.querySelector('.ptr');
    const singleCardHolder = cardsHolder.querySelectorAll('.registration-row');
    const obj = {};
    
    singleCardHolder.forEach(card => {
        const title = card.querySelector('.leave-registration-description').innerText;
        obj[title] = (obj[title] || 0) + 1;
    });
    
    return(obj);
}

console.log(coundRegistrations());

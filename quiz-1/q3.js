// function exp(y = 0) {
//     if (!this.private) {
//         this.private = y;
//         this.base = y;
//     }
//     return () => (this.private = this.private * this.base);
// }

// var exp3 = exp(3);

// console.log(exp3());
// console.log(exp3());

// var exp5 = exp(5);

// console.log(exp5());
// console.log(exp5());

function exp(y = 0) {
    if (!this.private) {
        this.private = y;
        this.base = y;
    }
    return () => (this.private = this.private * this.base);
}

var exp3 = new exp(3);

console.log(exp3());
console.log(exp3());

var exp5 = new exp(5);

console.log(exp5());
console.log(exp5());
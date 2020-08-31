function printString(str) {
    return new Promise((resolve, reject) => {
        console.log(str)
        resolve()
    })
}


async function printAll() {
    .then(() => printString("A"))
        .then(() => printString("B"))

    .then(() => printString("C"))


}
printAll()
export const numberFormat = (x, fixed, currency = true) => {
    // try {
    //     return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    // } catch (error) {
    //     console.log(error)
    //     return 0
    // }
    var formatter = new Intl.NumberFormat('th-TH', {
        // style: 'currency',
        // currency: 'THB',
        minimumFractionDigits:2,
        //maximumSignificantDigits: 3
        
    });

    if (!currency) {
        formatter = new Intl.NumberFormat('en-US');
    }

    return formatter.format(x);
}
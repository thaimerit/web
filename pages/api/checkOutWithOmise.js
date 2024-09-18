// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


// const omise = require("omise")({
//    publicKey: process.env.OMISE_PUBLIC_KEY,
//    secretKey: process.env.OMISE_SECRET_KEY
//  });

// async function test() {

// } 

// const createCharge = async () => {
//    const customer = await omise.customers.create({
//       email: "test@mail.com",
//       description: "jojo",
//       card: token.id
//    });

//    const charge = await omise.charges.create({
//       amount: 100,
//       currency: "thb",
//       customer: customer.id
//    })
   
//    console.log('Charge -->', charge);
// }

// export default async function createCreditChange(req, res) {

   
//       if (req.method === 'POST') {
//          try {
//             console.log("API POST");
//             console.log("params", req.body);
            
//             // const { email, name, amount, token } = req.body.params;
//             const { email, name, amount, token } = req.body.params;
//             console.log(email);
//             console.log(name);
//             console.log(amount);
//             console.log(token);
//             const customer = await omise.customers.create({
//                email,
//                description: name,
//                card: token
//             });

//             const charge = await omise.charges.create({
//                amount: amount,
//                currency: "thb",
//                customer: customer.id
//             })
            
//             console.log('Charge -->', charge);
//             return res.status(200).json(charge);
//          } catch (error) {
//             console.log(error);
//          }
//       } else {
//          res.status(200).json({ name: 'John Doe' })
//       }
   
   
// }
  
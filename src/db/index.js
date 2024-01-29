import mongoose from "mongoose";

const connectdb = async () => {
  //.............using promises..............

  // return new Promise((resolve, reject)=> {
  //       mongoose.connect(`${process.env.mongo}/MINI-PROJECT`)
  //      .then(() => {
  //           // console.log("");
  //           resolve("DATABASE connection successfull")
  //      }).catch((err) => {
  //           reject("DATABSE connection failed");

  //      })
  // })

  //..... using then catch.............

  // return mongoose.connect(`${process.env.mongo}/MINI-PROJECT`)
  //      .then(() => {
  //           console.log("DATABASE connection successfull");
  //      }).catch((err) => {
  //           console.log("DATABSE connection failed :" + err);
  //      })

  // ................using try catch................
  try {
     await mongoose.connect(`${process.env.mongo}/MINI-PROJECT`);
  } catch (error) {
    return error;
  }
};
export { connectdb };

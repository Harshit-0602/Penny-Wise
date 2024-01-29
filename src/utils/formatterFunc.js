
const formatName = (name) => {
  let arr = name.trim().toLowerCase().split(' ');
  // console.log(arr);
  // console.log(s.trim().split(' '));
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i]);
    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
    // console.log(arr[i]);
  }
    const result = arr.join(' ');
    // console.log(result);
    return result;
  // console.log(result);
}



const formatEmail = (email) => {
  // console.log(email);
  return email.includes("@gmail.com");
}

// const formatDate = (date) => {
//   const formattedDate = new Date(date);
//   // console.log(typeof(formattedDate));
//   return formattedDate.toLocaleString().split(", ");
//   // console.log(newDate);
// }

// console.log((formatDate("2024-01-27T06:27:56.917Z")));;

export { formatName , formatEmail};
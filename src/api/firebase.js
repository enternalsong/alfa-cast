// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import {getDatabase,ref,set,onValue,update} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTODOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: "alfa-cast",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDERING_ID,
  appId: import.meta.env.VITE_APP_ID
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log(app);
const database = getDatabase(app);
console.log(database);
const dbRef = ref(database,'Spotify');

export function writeUserData(userId, name, email,product,category) {  
    const db = getDatabase(app);
    set(ref(db, 'Spotify/user/' + userId), {
      username: name,
      email: email,
      product:product,
      category:category,
    }).then(()=>{
        //Data saved successfully
    }).catch((error)=>{
        console.log(`error:${error}`);
    })
}
// const testRef = ref(database,'Spotify/user'+"123456")
// set(testRef,{
//   username:'134',
//   email:'fs@gmail.com',
//   product:[""]
// });

// onValue(testRef,(snapshot)=>{
//   snapshot.forEach((childSnapshot)=>{
//     const childKey = childSnapshot.key;
//     if(childKey==='12345'){
//       console.log("try");
//       set(testRef,'Spotify/user'+"12345",{
//         username:'134',
//         email:'fs@gmail.com',
//         product:[{apple:"apple",banana:"banana"},{sky:"sky"}]
//       })
//     }
//   })
// })
  export function checkFirebase_user(userId,name,email,product,category,find){
    const dbRef = ref(database,'Spotify/user');
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          //console.log(childKey);

          if(childKey===`${userId}`){
            find =true;
          }
          // else{
          //   writeUserData(userId,name,email,product,category);            
          // }
        })
        if(find){
          console.log("no need to update");
        }
        else{
          writeUserData(userId,name,email,product,category);
        }

        // console.log(snapshot.val()); //show all val()
    
      }, {
        onlyOnce: true
      });
}
  export  function get_firebase_cg(userId){
    const dbRef = ref(database,`Spotify/user/${userId}`);
    let cg = null;
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        if(childKey==="category"){
          console.log(childData);
          cg = childData;
          console.log(cg);
        }
      })
      // console.log(snapshot.val()); //show all val(
    }, {
      onlyOnce: true
    });
  
    console.log(cg);
  }
onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      //console.log(childKey);
      if(childKey==="UserData"){
        console.log(childData);
      }
    })
    // console.log(snapshot.val()); //show all val()
  }, {
    onlyOnce: true
  });

  export function delete_firebase_cg(userId,cg){
    update(ref(database,`Spotify/user/${userId}`),{
      '/category':cg
    }).then(()=>{
      "update delete target cg"
    }).catch((error)=>{
      console.log(`error:${error}`);
    })
  }


export default database;


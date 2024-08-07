// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbRef = ref(database,'Spotify');
//write spotify data to the firebase
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
//chekc Firebase user is exist or not
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
//get Spotify userid data
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
//rename firebase category
export const rename_firebase_cg = (userId,cg_name,selected_cg)=>{
  console.log(selected_cg[1][Object.keys(selected_cg[1])]);
  set(ref(database,`Spotify/user/${userId}/`+ "category/"+ selected_cg[0]),{
    [cg_name]:selected_cg[1][Object.keys(selected_cg[1])]
  }).then(()=>{
      console.log("successful rename_firebase");
  }).catch((error)=>{
    console.log(`error:${error}`);
  })
}
//delete firebase cateogry
  export function delete_firebase_cg(userId,cg){

    update(ref(database,`Spotify/user/${userId}`),{
      '/category':cg
    }).then(()=>{
      "update delete target cg"
    }).catch((error)=>{
      console.log(`error:${error}`);
    })
  }
//save new podcast to the category
  export function save_firebase_pt(userId,selected_cg,pt){
    const updates = {};
    updates[Object.keys(selected_cg[1])] = pt;
    set(ref(database, `Spotify/user/${userId}/category/${selected_cg[0]}`),updates)
    .then(()=>{
      console.log("save new pt success");
    }).catch((error)=>{
      console.log(`error msg: ${error}`);
    })
  }
// delete podcast in your save category
  export function delete_firebase_show(userId,cg_open,array,index){
    console.log(array);
    set(ref(database,`Spotify/user/${userId}/category/${index}/${Object.keys(cg_open)}`),array)
    .then(()=>{
      console.log("delete success");
    }).catch((error)=>{
      console.log(`error msg:${error}`);
    })

  }
export default database;



const mongoose=require("mongoose")

const bcrypt=require("bcryptjs")



const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required for creating a user"],
        trim:true,   // Removes leading/trailing whitespaces
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique:[true,"email already exists"]

    },
    name:{
        type:String,
        required:[true,"name is required for creating an account"]
    },
    password:{
       type:String,
       required:[true,"password is required for creating an account"],
       minlength:[6,"password should be contain more then 6 character"],
       select:false     //when retrive query then password is not come untill we call password
    },
      
} ,{timestamps:true}    )   //user when create and when last time update


//this metthod is execute if any modified in user data or speciific user data
userSchema.pre("save",async function(){
    //user password hash to convert prevent password it is one way palning text to hash  not hash to plan text
    if(!this.isModified("password")){   //if not modified then nothing
        return ;
    }

    const hash=await bcrypt.hash(this.password,10)

    this.password=hash

   return;

})

//"I want to create my own function that every User object can use

//Every User object will now have a function named comparePassword()."
//So after fetching a user from MongoDB:

// const user = await User.findOne({ email });

// you can write

// await user.comparePassword(password);

// Notice

// user.comparePassword()

// We are calling a function on the user object.

//like use login then user enter the passsword then password convert in bcrypt then check store and bcrypt if both are smae thern return true

//remeber same password or texxt ke liye hash same hota hia

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema);

module.exports=userModel
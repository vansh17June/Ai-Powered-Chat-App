const User = require('../models/userModels');
const jwt=require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bcrypt = require('bcrypt');

async function createUser(req,res) {
  try {
    const {email,name,password} = req.body;
    console.log({email,name,password})
    const person = new User({
      email,name,password
    });
    const token =jwt.sign({ id: person._id }, process.env.secretkey,{
      expiresIn: '1d'
    }); 
    res.cookie('token', token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      
      sameSite: 'strict', // Prevent CSRF
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });
    await person.save();
    
    console.log('User created:', person);
    return res.status(201).json({ person, token });
  } catch (err) {
    console.error('Error creating user:', err.message);
  }
}
const loginUser = async (req, res) => {
  const { email, password } = req.body;
 console.log(email,password)
  try {
    // Check if user exists
    const person = await User.findOne({ email });
    if (!person) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, person.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: person._id }, process.env.secretkey, {
      expiresIn: '1d', // Token valid for 1 hour
    });

    // Save token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
     
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      person: {
        id: person._id,
        name: person.name,
        email: person.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const logout=(req,res)=>{
  res.clearCookie('token');
  res.status(200).json({message:'Logout successful'})
}
const UpdatePreviousSearch = async (req, res) => {
  try {
    const id = req.user;
    const person = await User.findById(id);

    if (!person) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { title, question, answer } = req.body;
    const searchHistory = person.SearchHistory;

    let found = false;

    // Iterate through search history to find the matching topic
    for (const item of searchHistory) {
      if (item.TopicWiseSearches.title === title) {
        found = true;
        item.TopicWiseSearches.search.push({ question, answer }); // Add question & answer
        break; // Exit the loop once found
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'Search history not found' });
    }

    await person.save(); // Save updated user data
    return res.status(200).json({ message: 'Search history updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const UpdateSearch=async(req,res)=>{
  const id=req.user;
  const person=await User.findById(id);
 const {title,question,answer}=req.body;
 const searchHistory=person.SearchHistory;
 searchHistory.push({TopicWiseSearches:{title,search:[{question,answer}]}})

 await person.save();

 return res.status(200).json({message:'Search history updated'})
}
const giveResponse=async(req,res)=>{
  const gemini_api_key = process.env.API_KEY;
  const googleAI = new GoogleGenerativeAI(gemini_api_key);
  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  try{
    let prompt=""
 const {question,history}=req.body;
 if(!history.length){
  prompt = "Here are the questions and their answers:\n\n";
 

 history.forEach((entry, index) => {
   prompt += `Q${index + 1}: ${entry.question}\nA${index + 1}: ${entry.answer}\n\n`;
 });
  prompt += `now answer my current question which is ${question} with refer to my previous chat if exist`;
 prompt+="when ansering my question do not tell me in response you are reffering to previous chats"
}else{
  prompt=question;
}
  
      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      console.log(response.text());
      return res.status(200).json({message:response.text()})
      
    } catch (error) {
      console.log("response error", error);
    }
  }
const getResponse=async(req,res)=>{
  const id=req.user;
  const person=await User.findById(id);
  const {title}=req.body;
  const searchHistory=person.SearchHistory;
  searchHistory.map((item)=>{
    if(item.TopicWiseSearches.title===title){
    return res.status(200).json({item})
    }
  })
  return res.status(404).json({message:'Search history not found'})
}
const getSearchHistory=async(req,res)=>{
  try{
  const id=req.user;
  const person=await User.findById(id);
  const searchHistory=person.SearchHistory;
  return res.status(200).json({searchHistory})
  }catch(error){
    console.log(error)
  }

}
module.exports = {
  createUser,loginUser,logout,UpdatePreviousSearch,UpdateSearch,giveResponse,getResponse,getSearchHistory
}



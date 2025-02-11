
import TestUser from '../models/test.model.js';
import Worker from "../models/worker.model.js"
import Job from "../models/job.model.js"
export const addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extract data from request body

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await TestUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user
    const newUser = new TestUser({
      username,
      email,
      password, 
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const normalizeCoordinate = (value) => {
    if (typeof value !== "number") {
      value = parseFloat(value);
    }
    return parseFloat(value.toFixed(6));
  };
export const addJob = async (req, res) => {
    try {
        const { title, description, location,userId } = req.body;
        console.log(location)
    
        if (!title || !description || !location) {
          return res.status(400).json({ error: "All fields are required." });
        }
    
        const newJob = new Job({    
          title,
          description,
          userId,
          location,
          status: "open",
        });
    
        await newJob.save();
    
        res.status(201).json({ message: "Job posted successfully", job: newJob });
      } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ error: error.message });
      }
};


// export const getNearJobs = async (req,res) => {
//     try {
//         const { longitude, latitude } = req.query;
//         console.log("location",longitude, latitude);
    
//         if (!longitude || !latitude) {
//           return res.status(400).json({ error: 'Longitude and latitude are required.' });
//         }
    
//         const jobs = await Job.find({
//           location: {
//             $near: {
//               $geometry: {
//                 type: 'Point',
//                 coordinates: [parseFloat(longitude), parseFloat(latitude)], // Worker location
//               },
//               $maxDistance: 15000, // 15km in meters
//             },
//           },
//           status: 'open', // Only show open jobs
//         });
    
//         res.json(jobs);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
// }



// Function to calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180; // Convert to radians

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};



export const getJobById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the job ID from the route parameters

    // Find the job by its ID
    const job = await Job.findById(id);

    // If no job is found, return a 404 status
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Return the job details in the response
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ error: error.message });
  }
};






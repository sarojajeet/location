import TestUser from '../models/test.model.js';
import Worker from "../models/worker.model.js"
import Job from "../models/job.model.js"

export const addWorker = async (req, res) => {
    try {
      const { fullname, email, password,phoneNumber } = req.body; // Extract data from request body
  
      // Basic validation
      if (!fullname || !email || !password ||!phoneNumber) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Check if the email already exists
      const existingUser = await Worker.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
  
      // Create a new user
      const newWorker = new Worker({
        fullname,
        email,
        password, 
        phoneNumber
      });
  
      // Save the user to the database
      await newWorker.save();
  
      // Respond with success
      res.status(201).json({
        message: 'newWorker created successfully',
        user: {
          id: newWorker._id,
          fullname: newWorker.fullname,
          email: newWorker.email,
        },
      });
    } catch (error) {
      console.error('Error adding newWorker:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const acceptJob = async (req, res) => {
    try {
      const { jobId, workerId } = req.body;
  
      if (!jobId || !workerId) {
        return res.status(400).json({ error: "Job ID and worker ID are required." });
      }
  
      // Find the job by ID
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ error: "Job not found." });
      }
  
      if (job.status !== "open") {
        return res.status(400).json({ error: "Job is no longer available for acceptance." });
      }
  
      // Update the job's status to 'accepted' and assign the user
      job.status = "accepted";
      job.workerId = workerId;
  
      await job.save();
  
      res.status(200).json({ message: "Job accepted successfully.", job });
    } catch (error) {
      console.error("Error accepting job:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Controller to get jobs within 15 km
export const getNearJobs = async (req, res) => {
    try {
        const { longitude, latitude } = req.query;
    
        if (!longitude || !latitude) {
          return res.status(400).json({ error: "Longitude and latitude are required." });
        }
    
        const normalizedLongitude = normalizeCoordinate(parseFloat(longitude));
        const normalizedLatitude = normalizeCoordinate(parseFloat(latitude));
    
        const jobs = await Job.find({
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [normalizedLongitude, normalizedLatitude],
              },
              $maxDistance: 18000, // 18 km radius for tolerance
            },
          },
          status: "open", // Only return open jobs
        });
    
        if (jobs.length === 0) {
          return res.status(200).json({ message: "No jobs found within the range." });
        }
    
        res.json(jobs);
      } catch (error) {
        console.error("Error finding nearby jobs:", error);
        res.status(500).json({ error: error.message });
      }
};


export const registerWorkerStep2 = async (req, res) => {
  try {
    const { workerId, workerType } = req.body;

    // Validate workerType
    const validTypes = ['self worker', 'contractor', 'worker under contractor'];
    if (!validTypes.includes(workerType)) {
      return res.status(400).json({ message: 'Invalid worker type' });
    }

    // Find and update worker
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { workerType },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({ message: 'Worker Type added successfully.', worker });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



export const verifyContractor = async (req, res) => {
  try {
    const { contractorId } = req.body;

    if (!contractorId) {
      return res.status(400).json({ message: 'Contractor ID is required' });
    }

    const contractor = await Worker.findById(contractorId);

    if (!contractor) {
      return res.status(404).json({ message: 'Invalid Contractor ID' });
    }

    // Ensure the workerType is "contractor"
    if (contractor.workerType !== 'contractor') {
      return res.status(403).json({ message: 'Worker is not a contractor' });
    }

    res.status(200).json({ message: 'Contractor verified successfully', contractor });

  } catch (error) {
    console.error("Error verifying contractor:", error.message);
    res.status(500).json({ message: 'Server error', error });
  }
};



export const registerWorkerStep3 = async (req, res) => {
  try {
    const { workerId } = req.body;

    // Extract uploaded file paths
    const aadhaarCardImage = req.files['aadhaarCardImage'] ? req.files['aadhaarCardImage'][0].path : null;
    const panCardImage = req.files['panCardImage'] ? req.files['panCardImage'][0].path : null;
    const selfie = req.files['selfie'] ? req.files['selfie'][0].path : null;

    // Ensure all images are provided
    if (!aadhaarCardImage || !panCardImage || !selfie) {
      return res.status(400).json({ message: 'All images are required' });
    }

    // Update worker document
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      {
        aadhaarCardImage,
        panCardImage,
        selfie,
        verification: false, // Not verified yet
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({ message: 'Step 3 completed. Registration done.', worker });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAcceptedJobsByWorker = async (req, res) => {
    try {
      const { workerId } = req.params; // Extract the workerId from the route parameters
  
      // Find all jobs with the status 'accepted' and the matching workerId
      const jobs = await Job.find({ status: "accepted", workerId });
  
      // If no jobs are found, return an empty array
      if (jobs.length === 0) {
        return res.status(200).json({ message: "No accepted jobs found.", jobs: [] });
      }
  
      // Return the list of accepted jobs
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching accepted jobs:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getWorkerById = async (req, res) => {
    try {
      const { id } = req.params; // Extract the job ID from the route parameters
  
      // Find the job by its ID
      const worker = await Worker.findById(id);
  
      // If no job is found, return a 404 status
      if (!worker) {
        return res.status(404).json({ error: "Worker not found." });
      }
  
      // Return the job details in the response
      res.status(200).json(worker);
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      res.status(500).json({ error: error.message });
    }
  };
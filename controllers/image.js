// import Clarifai from 'clarifai';
import {ClarifaiStub, grpc} from 'clarifai-nodejs-grpc';

// console.log(Clarifai); //get the model id

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 26f21ff3181144efb40c68fc2654f904");

// const app = new Clarifai.App({
//     //will be in backend (server)
//     apiKey: '26f21ff3181144efb40c68fc2654f904'
// });

const handelApiCall = (req,res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }

            res.json(response);
        }
    );


    // app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
    // .then(data => {
    //     res.json(data);
    // })
    // .catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req,res,db) => {
    const id = req.body.id;

    db('users').where('id','=',id)
        .increment('entries',1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

export {handleImage,handelApiCall};
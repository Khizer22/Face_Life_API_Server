// import Clarifai from 'clarifai';
import {ClarifaiStub, grpc} from 'clarifai-nodejs-grpc';
import * as fs from 'fs';

// console.log(Clarifai); //get the model id

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 26f21ff3181144efb40c68fc2654f904");

// const app = new Clarifai.App({
//     //will be in backend (server)
//     apiKey: '26f21ff3181144efb40c68fc2654f904'
// });

const handelApiCall = (req,res,detection_type) => {
    let MODEL_ID = null;

    switch (detection_type) {
        case 'face':
            MODEL_ID = "a403429f2ddf4b49b307e318f00e528b";
            break;

        case 'general':
            MODEL_ID = "aaa03c23b3724a16a56b629203edc62c";
            break;
    
        default:
            MODEL_ID = "a403429f2ddf4b49b307e318f00e528b";
            break;
    }

    console.log(req.file);

    let mySource = null;
    if (req.file !== undefined)
        mySource = {base64: req.file.buffer};
    else
        mySource = {url: req.body.url};

    stub.PostModelOutputs(

        {
            // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
            model_id: MODEL_ID,
            inputs: [{data: {image: mySource}}]
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

const handleAPICallInfo = (req,res) => {

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
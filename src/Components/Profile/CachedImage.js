import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
//import { Storage } from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob';
const dirs = RNFetchBlob.fs.dirs;

//gonna simplify this a bit, and make a new component for userimages
const CachedImage = props => {
    const {placeholder, imageKey, width, height, style} = props;
    const [loaded, setLoaded] = useState(false);

    const downloadImage = async (key) => {
        //this url is ridiculously long lol
        const url = '';//await Storage.get(key);
        RNFetchBlob
            .config({
                // response data will be saved to this path if it has access right.
                path : `${dirs.DocumentDir}/${key}`
            })
            .fetch('GET', url, {
                //some headers ..
            })
            .then((res) => {
                // the path should be dirs.DocumentDir + 'path-to-file.anything'
                console.log('The file saved to ', res.path())
                setLoaded(true);
            });
    };

    useEffect(() => {
        if(!imageKey)
            return;

        RNFetchBlob.fs.exists(`${dirs.DocumentDir}/${imageKey}`).then(imageSaved =>{
            if(imageSaved)
                setLoaded(true);
            else
                downloadImage(imageKey);
        });

    }, [imageKey]);

    if(loaded)
        return <Image source={{uri: `file://${dirs.DocumentDir}/${imageKey}`}} style={style}/>;
    else
        return <View style={{width: width, height: height, justifyContent: 'center', alignItems: 'center'}}>{placeholder}</View>;

};

export default CachedImage;

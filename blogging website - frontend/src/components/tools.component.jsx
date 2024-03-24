//importing tools packages
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/aws";


//functions that handles uploading images to the blog editor(from EditorJS docs)
const uploadImageByURL = (e) => {
    let link = new Promise(( resolve, reject ) => {
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if(url){
            return {
                success: 1,
                file: { url }
            }
        }
    })
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl : uploadImageByURL,
                uploadByFile: uploadImageByFile
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Heading...",
            levels: [2,3],
            defaultLevel: 2
        }
    },
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode
}
import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PublishForm = () => {

    let characterLimit = 200;
    let tagLimit = 10;

    let { blog_id } = useParams();
    
    let { blog, blog: { banner, title, content, tags, des }, setBlog, setEditorState } = useContext(EditorContext);

    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;

        setBlog({ ...blog, title: input.value });
    }

    const handleBlogDesChange = (e) => {
        let input = e.target;

        setBlog({ ...blog, des : input.value });
    }

    const handleDesKeyDown = (e) => {
        if(e.keyCode == 13){//enter key
            e.preventDefault();
        }
    }

    const handleTagKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            //if the user presses Enter or Comma
            e.preventDefault();

            let tag = e.target.value;

            if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({ ...blog, tags: [...tags, tag] })
                }
            }
            else{
                toast.error(`You can add maximum ${tagLimit} tags`)
            }

            e.target.value = "";
        }
    }

    const publishBlog = (e) => {

        if(e.target.className.includes("disable"))
            return;

        if(!title.length)
            return toast.error("Give your blog a title")
    
        if(!des.length || des.length > characterLimit)
            return toast.error("Give a description to your blog under " + characterLimit + " characters")

        if(!tags.length)
            return toast.error("Enter atleast 1 tag to help us rank your blog")

        let loadingToast = toast.loading("Publishing...");
        e.target.classList.add("disable");


        let blogObj = {
            title, banner, des, content, tags, draft: false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
            headers: {
                'Authorization' : `Bearer ${access_token}`
            }
        })
        .then(() => {
            e.target.classList.remove('disable');

            toast.dismiss(loadingToast);
            toast.success("Published 👍");

            setTimeout(() => {
                navigate("/dashboard/blogs")
            }, 1000);
        })
        .catch(( { response } ) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);

            return toast.error("Could not publish blog");
        })
    }


    return (

        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button
                    className="w-12 h-12 absolute z-10 right-[5vw] top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}
                >
                    <i class="fi fi-br-cross"></i>
                </button>

                <div className="w-full max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="" />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{ title }</h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input 
                        className="input-box pl-4j"
                        type="text" 
                        placeholder="Blog Title" 
                        defaultValue={title} 
                        onChange={handleBlogTitleChange}
                        />

                    <p className="text-dark-grey mb-2 mt-9">Short Description about your blog</p>
                    
                    <textarea
                        className="h-40 resize-none leading-7 input-box pl-4"
                        maxLength={characterLimit}
                        defaultValue={des} 
                        onChange={handleBlogDesChange}
                        onKeyDown={handleDesKeyDown}
                    ></textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">{ des.length } / { characterLimit }</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - ( Helps in searching and ranking your blog )</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" 
                            type="text" 
                            placeholder="Topic"
                            onKeyDown={handleTagKeyDown}
                        />
                        
                        {
                            tags.map((tag, i) => {
                                return <Tag tag={tag} tagIndex={i} key={i} />
                            })
                        }

                    </div>
                    
                    <p className="mt-1 text-dark-grey text-sm text-right">{ tags.length } / { tagLimit }</p>

                    <button 
                        className="btn-dark px-8"
                        onClick={publishBlog}
                    >
                        Publish
                    </button>

                </div>

            </section>
        </AnimationWrapper>

    )
}

export default PublishForm;
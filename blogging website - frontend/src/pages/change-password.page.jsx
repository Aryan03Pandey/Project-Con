import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App"
import axios from "axios";


const ChangePassword = () => {

    let changePasswordForm = useRef();
    let { userAuth: { access_token } } = useContext(UserContext);

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Inputs cannot be empty")
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Updating");
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password Updated");
        })
        .catch(({ response }) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error);
        })  

    }

    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePasswordForm} action="">
                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox 
                        name="currentPassword" 
                        type="password" 
                        className="profile_edit_input"
                        placeholder="Current Password"
                        icon="fi-rr-unlock"   
                    />

                    <InputBox 
                        name="newPassword" 
                        type="password" 
                        className="profile_edit_input"
                        placeholder="New Password"
                        icon="fi-rr-unlock"   
                    />

                    <button onClick={handleSubmit} className="btn-dark px-10" type="submit">Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword;
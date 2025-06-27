import React, {useEffect, useState} from 'react'
import "./Switch.scss"

const Switch = () => {
    const [themeToggle, setThemeToggle] = useState(false)

    const currentTheme = localStorage.getItem("theme");
    const browserCurrentTheme = window.matchMedia("(prefers-color-scheme: dark)");

    useEffect(() => {
        if(!currentTheme){
            if(browserCurrentTheme?.matches){
                setDark();
            }
            else{
                setLight();
            }
        }else{
            if(currentTheme === "dark"){
                setDark();
            }
            else{
                setLight();
            }
        }
    }, [])
    
    const setDark = () => {
        localStorage.setItem("theme", "dark");
        setThemeToggle(true)
        document.documentElement.setAttribute("data-theme", "dark")
    }
    
    const setLight = () => {
        localStorage.setItem("theme", "light");
        setThemeToggle(false)
        document.documentElement.setAttribute("data-theme", "light")
    }
    
    const toggleThemeSwitch = (e) => {
        if(e.target.checked){
            setDark(); 
        }
        else{
            setLight(); 
        }
    }
    return (
        <div className="toggleSwitch">
            {themeToggle ? <span>🌙</span> : <span>🌞</span>}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label class="switch">
                <input type="checkbox" onChange={toggleThemeSwitch} checked={themeToggle}/>
                <span class="slider round"></span>
            </label>
            
        </div>
    )
}

export default Switch
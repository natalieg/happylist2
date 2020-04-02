import React, { Component } from 'react';

export default class  ContactForm extends Component {
   state = {
            name: '',
            email: '',
            password: '',
            message: ''

        }
        //this.state = {value: ''};

    
    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    handleSubmitData = (e) => {
        e.preventDefault();
        console.log(this.state)
        //console.log("send button was clicked")
        this.setState({
            name: '',
            email: '',
            password: '',
            message: ''
        });
    }
    // CANCEL / DELETE FUNCTION - IF REQUIRED
    // handleCancelData = () => {
    //     console.log("cancel button was clicked")
    // }

    // validate = data => {
    //     const errors = {};
    //       if (!isEmail(data.email)) errors.email = 'Email is required';
    //       if (!data.password) errors.password = 'Password is required';
    //     return errors;
    // };

    render() {
        return (
            <div className="contactFormContainer">
                <form action="">
                    <h2>Contact Us</h2>
                    
                    <label htmlFor="name"><b>Name</b>
                        <input
                            type="text" 
                            placeholder="Enter Name" 
                            name="name" 
                            value={this.state.name}
                            required
                            onChange ={e => this.handleChange(e)}
                        />
                    </label>

                    <label htmlFor="email"><b>Email</b>
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            name="email" 
                            value={this.state.email}
                            required
                            onChange={e => this.handleChange(e)}
                        />
                    </label>

                    <label htmlFor="message"><b>Message</b>
                        <textarea 
                            placeholder="Enter Message" 
                            name="message" 
                            value={this.state.message}
                            required
                            onChange={e => this.handleChange(e)}
                        />
                    </label>

                   <button 
                        type="submit" 
                        className="btn" 
                        onClick={e => this.handleSubmitData(e)}>
                        Send
                   </button>  
                </form>
            </div>
        )
    }
}





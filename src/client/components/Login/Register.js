import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {isUserExist, required, validateImage, maxLength10} from '../../utils/formValidation'
import {renderField} from '../../utils/formComponents'
import LoginActions from './actions'
import SnackActions from '../SnackBar/actions'
import Avatar from '@material-ui/core/Avatar'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import PersonIcon from '@material-ui/icons/Person'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import Checkbox from '@material-ui/core/Checkbox'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import PlacesAutocomplete, { geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import Loader from 'react-loader-spinner'

import './Login.scss';


const renderCheckbox = ({ input, name }) => (
    <FormControlLabel
          control={ <Checkbox style={{color: 'black',width:'0px', height:'0px'}}
                          icon={<VisibilityIcon fontSize="small"/>}
                          checkedIcon={<VisibilityOffIcon fontSize="small"/>}
                          id={name}
                          color="default"
                          checked={input.value ? true : false}
                          onChange={input.onChange}
                    />}
    />
);

//TODO: check trigger form change
//show password
const handleChange = (event, input, snack_callback) => {
    event.preventDefault();
    const types = "image/jpeg, image/png , image/jpg";
    if (!types.includes(event.target.files[0].type)) {
        snack_callback(false, "Picture type must be jpeg/png/jpg");
    }
    let imageFile = event.target.files[0];
    if (imageFile) {
        const localImageUrl = URL.createObjectURL(imageFile);
        const imageObject = new window.Image();

        imageObject.onload = () => {
            imageFile.width = imageObject.naturalWidth;
            imageFile.height = imageObject.naturalHeight;
            input.onChange(imageFile);
            URL.revokeObjectURL(imageFile);
            snack_callback(true, "Picture has been uploaded successully");
        };
        imageObject.src = localImageUrl;
    }
    console.log("file trigger form-change.");
};

const renderFileField = ({snack_callback, input, label, type, meta: {invalid, error}}) => (
    <div>
        <label className="login-label">{label}</label>
        {invalid && error &&
        <span className="danger-error">{error}</span>}
        <input className={"login-input upload-container center" + (invalid && error ? "-error" : "")}
                accept='image/*'
                type={type}
                onChange={event => handleChange(event, input, snack_callback)} //TODO: check trigger form change
        />
    </div>
);

const renderLocationField = ({label, input, meta: {touched, error}}) => {

    const handleChange = address => {
        input.onChange({name: address});
    };

    const handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                input.onChange({name: address, location: latLng});
            })
            .catch(error => console.error("Error", error));
    };

    const SuggestionsList = ({
                                 getInputProps,
                                 getSuggestionItemProps,
                                 suggestions,
                                 loading
                             }) => (
        <div className="autocomplete-root">
            <input {...getInputProps({
                className: "login-input" + (touched && error ? "-error" : ""),
            })} />
            <div className="autocomplete-container">
                {loading && <Loader type="Oval" color="Blue" height={30} width={30}/>}
                {suggestions.map(suggestion => (
                    <div{...getSuggestionItemProps(suggestion,
                        {
                            className: "line-autocomplete-container",
                        })}>
                        <LocationOnOutlinedIcon fontSize="small"/>
                        {suggestion.description}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <label className="login-label">{label}</label>
            {touched && (error &&
                <span className="danger-error">{error}</span>)}
            <PlacesAutocomplete onChange={handleChange}
                                onSelect={handleSelect}
                                value={input.value ? input.value.name : ""}>
                {SuggestionsList}
            </PlacesAutocomplete>
        </div>
    );
};

class Register extends Component {

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.user_name !== prevProps.user_name) {
            console.log('re-update');
            this.props.isUserExistEventHandler(this.props.user_name);
        }
    }
    render() {
        const {handleSubmit, pristine, reset, submitting, invalid, hidePassword} = this.props;
        console.log('is user exist: ' + this.props.user_names);
        return (
            <div className="inner-container">
                <Avatar className="avatar" src={this.props.avatar} 
                        style={{width: "90px",height: "90px"}}/>
                <div className="header">Create Account</div>
                <div className="box">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <Field name="user_name" type="text"
                                   component={renderField} label="User name"
                                   validate={[required, isUserExist, maxLength10]}/>
                                   <span className="fa"><PersonIcon fontSize="small"/></span>
                        </div>
                        <div className="input-group">
                            <Field name="password" type={hidePassword ?  "text" : "password"}
                                   component={renderField} label="Password"
                                   validate={[required]}/>
                                   <span className="fa" style={{right:'3px'}}> 
                                        <Field name="hidePassword" component={renderCheckbox}/>
                                   </span>
                        </div>
                        <div className="input-group">
                            <Field name="avatar" type="file"
                                   snack_callback={(isSucc, message) => this.props.openSnackBar(isSucc, message)}
                                   component={renderFileField} label="Picture"
                                   validate={[validateImage]}/>
                                   <span className="fa"><AddPhotoAlternateIcon fontSize="small"/></span>
                                   
                        </div>
                        <div className="input-group">
                            <Field name="location" type="text"
                                   component={renderLocationField} label="Location"
                                   validate={[required]}/>
                        </div>
                        <div className="center">
                            <button className="btn" type="submit"
                                    disabled={invalid || submitting}>Register
                            </button>
                            <button className="btn" type="button"
                                    disabled={pristine || submitting}
                                    onClick={reset}>Clear Values
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Register = reduxForm({
    form: 'RegisterFormValidation',  // a unique identifier for this form
    required,                        // <--- validations function given to redux-form
    isUserExist,
    validateImage,
    maxLength10,
})(Register);

const selector = formValueSelector('RegisterFormValidation')

Register = connect(state => {
  // can select values individually
  const hidePassword = selector(state, 'hidePassword')
  return { hidePassword }
})(Register) 

const mapStateToProps = (state) => {
    return {
        user_names: state['login'].get('user_names'),
        avatar: state['login'].get('avatar'),
        user_name: state['login'].get('user_name'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackBar: (isSucc, message) => {
            dispatch(SnackActions.openSnackBar(isSucc, message));
        },
        closeSnackBar: () => {
            dispatch(SnackActions.closeSnackBar());
        },
        isUserExistEventHandler: (name) => {
            dispatch(LoginActions.isUserExist(name));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
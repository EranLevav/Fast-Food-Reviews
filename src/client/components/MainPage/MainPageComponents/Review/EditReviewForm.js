import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Field, Form, reduxForm} from 'redux-form'
import {makeStyles} from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import {required, validateImage, maxLength30} from '../../../../utils/formValidation';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SnackActions from "../../../SnackBar/actions";
import {renderDropzoneField} from '../GenericComponents/renderDropzoneField';
import {multipleFileChangedHandler} from "../../../../utils/ImageHandler";
import MainActions from "../../actions";

import './Review.scss'

//TODO: FIX EDIT WITH PIC
const renderField = ({input, label, type, meta: {touched, error}}) => (

    <div>
        <label className="review-restaurant-label">{label}</label>
        {touched && (error &&
            <span className="review-danger-error">{error}</span>)}
        <div>
            <input className={"review-restaurant-input" + (touched && error ? "-error" : "")} {...input} type={type}/>
        </div>
    </div>
);

const renderRatingField = ({label, input, meta: {touched, error}}) => {

    const useStyles = makeStyles({
        root: {
            width: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: ''
        },
    });

    const customIcons = {
        1: {
            icon: <SentimentVeryDissatisfiedIcon/>,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon/>,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon/>,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon/>,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon/>,
            label: 'Very Satisfied',
        },
    };

    const labels = {
        1: 'Useless',
        2: 'Poor',
        3: 'Ok',
        4: 'Good',
        5: 'Excellent',
    };

    const IconContainer = (props) => {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    };

    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <label className="review-restaurant-label">{label}</label>
            {touched && (error &&
                <span className="review-danger-error">{error}<i className="fa fa-exclamation-triangle"></i></span>)}
            <div className="review-restaurant-rating">
                <Rating
                    name="customized-icons"
                    getLabelText={value => customIcons[value].label}
                    IconContainerComponent={IconContainer}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    {...input}
                />
                {<Box ml={2}>{labels[hover !== -1 ? hover : (input.value !== '' ? input.value : value)]}</Box>}
            </div>
        </div>
    );
};

class EditReviewForm extends Component {

    render() {
        const {handleSubmit, pristine, reset, submitting, invalid} = this.props;
        const rating_fields = [
            {name: 'bathroom_quality', label: 'Bathroom Quality', validation: [required]},
            {name: 'staff_kindness', label: 'Staff Kindness', validation: [required]},
            {name: 'cleanliness', label: 'Cleanliness', validation: [required]},
            {name: 'drive_thru_quality', label: 'Drive-thru quality', validation: []},
            {name: 'delivery_speed', label: 'Delivery Speed', validation: []},
            {name: 'food_quality', label: 'Food Quality', validation: [required]}
        ];
        const text_fields = [
            {name: 'restaurant_name', label: 'Restaurant name', validation: [required]},
            {name: 'comment', label: 'Comment', validation: [maxLength30]}
        ];

        return (
            <div className="root">
                <div className="review-box-container">
                    <div className="review-header">Edit your Review</div>
                    <form onSubmit={handleSubmit((values) => this.props.submitReview(values, this.props.user_name, reset))}>
                        {text_fields.map((field, index) =>
                            <div className="review-input-group" key={index}>
                            <Field name={field.name} type="input"
                                   component={renderField} label={field.label}
                                   validate={field.validation}
                            />
                            </div>)
                        }
                        {rating_fields.map((field, index) =>
                            <div className="review-input-group" key={index}>
                                <Field name={field.name}
                                       component={renderRatingField}
                                       label={field.label}
                                       validate={field.validation}
                                />
                            </div>)
                        }
                        <div className="review-input-group">
                            <Field
                                name="files"
                                component={renderDropzoneField}
                            />
                        </div>
                        <div className=" text center">
                            <button className="review-btn" type="submit" 
                                    disabled={submitting}>
                                Submit Review
                            </button>
                            <button className="review-btn" type="button" 
                                    disabled={submitting} onClick={reset}>
                                Undo Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

EditReviewForm = reduxForm({
    form: 'EditReviewsFormValidation',  // a unique identifier for this form
    required,
    validateImage,
    maxLength30,
    enableReinitialize: true,
})(EditReviewForm);

// EditReviewForm = connect(
//   state => ({
//     initialValues: state.data // pull initial values from state reducer
//   }),
//   { load: loadAccount } // bind account loading action creator
// )(EditReviewForm)

const mapStateToProps = (state) => {
    return {
        user_name: state['login'].get('user_name'),
        location: state['login'].get('location'),
        avatar: state['login'].get('avatar'),
        token: state['login'].get('token'),
        initialValues: state['main'].get('data_edit_review'),   //populate form when "Edit" is clicked

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackBar: (isSucc, message) => {
            dispatch(SnackActions.openSnackBar(isSucc, message));
        },
        submitReview: (values, user_name, resetCallbck) => {
            console.log('testttttt submit review', values);
            console.log(values);
            if (!values['files']) { //if no pictures were added
                dispatch(MainActions.editReview(values))
            } else {
                    multipleFileChangedHandler(values['files'], cropped_files => {
                        values['files'] = cropped_files;
                        console.log(values['cropped_files']);
                        dispatch(MainActions.editReview(values))
                    });
            }
        },
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(EditReviewForm);

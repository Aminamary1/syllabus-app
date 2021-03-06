
import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
//'use strict';

//const {Editor, EditorState, RichUtils} = Draft;


class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
        this.props.setPlainText(editorState.getCurrentContent().getPlainText())
        this.setState({editorState})
    };

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;
    console.log(editorState);

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    console.log(className);
    var contentState = editorState.getCurrentContent();
    console.log(contentState);
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Type here..."
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};



function Button() {

  const [inputs, setInputs] = React.useState([
      { id: 1, name: 'Input 1', value: '' },
  ])

  const [testtt, setTesttt] = React.useState(0)

  const handleChange = (evt) => {

      let inputsState = inputs
      inputsState.forEach(input => {
          if (input.name === evt.target.name) {
              input.value = evt.target.value
          }
      })

      setInputs(inputsState)

      console.log(inputs)
  }

  const handleAdd = () => {
      setInputs([...inputs, { id: new Date().getTime(), name: new Date().getTime().toString(), value: '' }])
      console.log(inputs)
  }


  const testt = () => {
      setTesttt(new Date().getTime())
  }

return (
  <div className="App">
    <header className="App-header">


        {inputs.map(input => <InputComponent key={input.id} input={input} onChange={handleChange} />)}

        <button onClick={handleAdd}>Add more</button>
        <button onClick={testt}>Test</button>

    </header>
  </div>
);
}

function Function1() {

  //// let userInput = '';
  //here let [userInput, setUserInput] = React.useState('')

  //here function handleChange(event) {
    //// userInput = event.target.value
    //here setUserInput(event.target.value)
    //this.setState({ [field]: evt.target.value });
    // here console.log(userInput)
  //here }

  //rich text editor
  //homework / exam percentage
  //checkbox
  //render another office hours by click button on liste
  //policies collapsible


    //render another 
    const [inputs, setInputs] = React.useState([
        { id: 1, name: 'Input 1', value: '' },
    ])

    const [testtt, setTesttt] = React.useState(0)

    const handleChangeAutoGen = (evt) => {

        let inputsState = inputs
        inputsState.forEach(input => {
            if (input.name === evt.target.name) {
                input.value = evt.target.value
            }
        })

        setInputs(inputsState)

        console.log(inputs)
    }

    const handleAdd = () => {
        setInputs([...inputs, { id: new Date().getTime(), name: new Date().getTime().toString(), value: '' }])
        console.log(inputs)
    }

    const testt = () => {
        setTesttt(new Date().getTime())
    }

    //rich text editor
 // const [editorState, setEditorState] = React.useState(
 //   () => EditorState.createEmpty(),
 // );


  const [state, setState] = React.useState({
    course_num: "",
    course_name: "",
    course_section: "",
    meeting_location: "",
    course_start_date: "",
    course_end_date: "",
    course_meeting_type: "",
    course_meeting_days: "",
    course_start_times: "",
    course_end_times: "",
    instructor_name: "",
    email: "",
    phone: "",
    office_location : "",
    //Rich Text Editor Text
    RichTextCourseGoal : "",
    RichTextPrereq : "",

    RichTextRequiredTextbooks: "",
    RichTextAdditionalRequiredMaterials: "",
    RichTextLabInfo: "",
    RichTextAdditionalMaterials: "",
    RichTextExamPolicies: "",
    RichTextAdditionalContent: "",
   //meeting days
    meeting_mon: false,
    meeting_tues: false,
    meeting_wed: false,
    meeting_thurs: false,
    meeting_fri: false,
    meeting_sat: false,
    meeting_sun: false,
    //office hour days
    office_mon: false,
    office_tues: false,
    office_wed: false,
    office_thurs: false,
    office_fri: false,
    office_sat: false,
    office_sun: false,

    office_start_time : "",
    office_end_time : "",

/*
    course_goals : "",
    prerequisites : "",
    required_books : "",
    addition_required_materials : "",
    lab_information :"",
    additional_materials:"",
    exam_policies : "",
    additional_content : "",*/
    disability_statement : false
  })


  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
    console.log(evt.target.name, value);
    console.log(state);
  }

  function handleRichEditorChange(key, value) {
    
    setState({
      ...state,
      [key]: value
    });
    console.log(key, value);
    console.log(state);
  }

  function handleChangeCheckbox(evt) {
        const value =
          evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
        setState({
          ...state,
          [evt.target.name]: value
        });
        
        console.log(evt.target.name, value);
        console.log(state);
    }
////////////////start///////
    const [readMore,setReadMore]=React.useState(false);
    
    //const extraContent = "here the explanation";
    
    const extraContent=<div>
        <p>
        Academic dishonesty is not limited to simply cheating on an exam or assignment. The following is quoted directly from the "PSU Faculty Senate Policies for Students" regarding academic integrity and academic dishonesty: "Academic integrity is the pursuit of scholarly activity free from fraud and deception and is an educational objective of this institution. Academic dishonesty includes, but is not limited to, cheating, plagiarizing, fabricating of information or citations, facilitating acts of academic dishonesty by others, having 
12unauthorized possession of examinations, submitting work of another person or work previously used without informing the instructor, or tampering with the academic work of other students."
        </p>
    </div>; 
    const linkName=readMore?'Academic Integrity Statement << ':'Academic Integrity Statement >> '


////////////////end///////

 
  return (
      <>
        <div id="main-container">
        <div class="container">
        <div class="row intro">
            <div class="col12">
                <h1 id="title">Syllabus Generator</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi egestas faucibus fringilla. Mauris magna lectus, egestas ut dolor a, malesuada gravida lectus. Proin lobortis nunc id consectetur tempor. Donec quis mauris dapibus ex iaculis sollicitudin. Donec id ligula arcu. Integer luctus magna metus, vel tempor dui iaculis eu. Aenean porta maximus dapibus. Vivamus euismod felis quam, in rhoncus dolor efficitur eu. Morbi quis diam vel eros consectetur tristique finibus quis lorem. Vivamus tristique venenatis tortor sit amet ultricies. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam lectus eros, fringilla et sem quis, consectetur lacinia sem. Curabitur at quam eu orci consequat accumsan sed vitae dui.</p>
                <div class="intro-buttons">
                    <button type="button" class="btn btn-primary btn-lg">
                        Create a Syllabus
                    </button>
                    <button type="button" class="btn btn-primary btn-lg">
                        Generate a Template
                    </button>
                </div>
            </div>
        </div>
    
        <div class="row contents">
            <div class="col">
            <div class="box">
    
                <h2>Syllabus Contents</h2>
                <div class="information">
                <p id="description">
                    Fill in the sections below to create a syllabus.
                </p>
             
                <form id="syllabus-generator">
               
                <fieldset>
                    <legend>Course Information</legend>
                    <div class="form-section">
                    <p class="description">Description for information in this section goes here.</p>
                    <div class="form-field-inline">
                      <label for="course-number">Course Number:</label>
                      <input type="text" id="course-number" placeholder="EDUC 305" 
          name="course_num"
          value={state.course_num}
          onChange={handleChange} />
                    </div>
                      <div class="form-field-inline">
                      <label for="course-name">Course Name:</label>
                      <input type="text" id="course-name" placeholder="Creative Arts" 
          name="course_name"
          value={state.course_name}
          onChange={handleChange}/>
                    </div>
                    <div class="form-field-inline">
                      <label id="course-section">Section:</label>
                      <input type="email" id="course-section" placeholder="001"
          name="course_section"
          value={state.course_section}
          onChange={handleChange}/>
                    </div>
                    <div class="form-field-inline">
                      <label for="meeting-location">Meeting Location:</label>
                      <input type="text" id="meeting-location" placeholder="Olmsted 205"
          name="meeting_location"
          value={state.meeting_location}
          onChange={handleChange}/>
                    </div>
                    </div>
                </fieldset>
    
                <fieldset>
                    <legend>Course Schedule & Meeting Times</legend>
                    <div class="form-section">
                        <p class="description">Description for information in this section goes here.</p>
                        <div class="form-field-inline">
                            <label for="start-date">Course Start Date:</label>
                            <input id="end-date" type="date" 
                              name="course_start_date"
                              value={state.course_start_date}
                              onChange={handleChange}/>
                        </div>
                        <div class="form-field-inline">
                            <label for="end-date">Course End Date:</label>
                            <input id="end-date" type="date"
                            name="course_end_date"
                            value={state.course_end_date}
                            onChange={handleChange}
                            />
                        </div>
                        <h4>Meeting Times</h4>
                            <div class="radio-set">
                                <span class="title">Meeting Type:</span> 
                                <div class="form-group" >
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="meeting-class" name="course_meeting_type" value="class" class="custom-control-input" 
                                    checked={state.course_meeting_type === "class"}
                                    onChange={handleChange}
                                    />
                                    <label for="meeting-class" class="custom-control-label">Class</label>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="meeting-lab" name="course_meeting_type" value="lab" class="custom-control-input"
                                    checked={state.course_meeting_type === "lab"}
                                    onChange={handleChange}
                                    />
                                    <label for="meeting-lab" class="custom-control-label">Lab</label>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="meeting-other" name="course_meeting_type" value="other" class="custom-control-input"
                                    checked={state.course_meeting_type === "other"}
                                    onChange={handleChange}
                                    />
                                    <label for="meeting-other" class="custom-control-label">Other</label>
                                </div>
                                </div>
                            </div> 
                             
                        <div class="radio-set">
                            <span class="title">Day(s):</span> 
                            <div class="form-group">
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-mon" name="meeting_mon" value="monday"
                                checked={state.meeting_mon}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-mon" class="custom-control-label">Mon</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-tues" name="meeting_tues" value="tuesday"
                                checked={state.meeting_tues}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-tues" class="custom-control-label">Tues</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-wed" name="meeting_wed" value="wednesday"
                                checked={state.meeting_wed}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-wed" class="custom-control-label">Wed</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-thurs" name="meeting_thurs" value="thursday"
                                checked={state.meeting_thurs}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-thurs" class="custom-control-label">Thurs</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-fri" name="meeting_fri" value="friday"
                                checked={state.meeting_fri}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-fri" class="custom-control-label">Fri</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-sat" name="meeting_sat" value="saturday"
                                checked={state.meeting_sat}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-sat" class="custom-control-label">Sat</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="meet-sun" name="meeting_sun" value="sunday"
                                checked={state.meeting_sun}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="meet-sun" class="custom-control-label">Sun</label>
                            </div>  
                        </div>
                    </div>
                    <div class="form-row">
                            <div class="col">
                            <label id="start-time">Start Time:</label>
                            <input type="time" id="start-time"
                            name="course_start_times"
                            value={state.course_start_times}
                            onChange={handleChange}
                            />
                            
                            </div>
                            <div class="col">
                            <label id="end-time">End Time:</label>
                            <input type="time" id="end-time"
                            name="course_end_times"
                            value={state.course_end_times}
                            onChange={handleChange}
                            />
                            </div>  
                        </div>
                        <div class="add-another">
                            <button class="btn btn-outline-secondary btn-sm" > 
                            + Add Another Meeting
                            </button>
                        </div>
                    </div>
                </fieldset>
    
           
                
                <fieldset>  
                    <legend>Contact Information</legend>
                    <div class="form-section">
                        <p class="description">Description for information in this section goes here.</p>
                        <div class="form-field-inline">
                            <label for="name">Instrutor Name:</label>
                            <input type="text" id="name" name="name" placeholder="Dr. John Smith" required="Required"
                            name="instructor_name"
                            value={state.instructor_name}
                            onChange={handleChange}
                            />  
                        </div>
                        <div class="form-field-inline">
                          <label for="email">Email:</label>
                          <input type="email" id="email" name="user_email" placeholder="abc@psu.edu" required=""
                          name="email"
                          value={state.email}
                          onChange={handleChange}
                          />
                        </div>
                        <div class="form-field-inline">
                          <label for="phone">Phone:</label>
                          <input type="tel" id="phone" name="phone" placeholder="000-000-0000" required=""
                          name="phone"
                          value={state.phone}
                          onChange={handleChange}
                          />  
                        </div>
                        <div class="form-field-inline">
                          <label for="office">Office Location:</label>
                          <input type="text" id="office" name="office" placeholder="Olmsted 203" required=""
                          name="office_location"
                          value={state.office_location}
                          onChange={handleChange}
                          /> 
                        </div>
                        <h4>Office Hours</h4>
                        <div class="radio-set">
                            <span class="title">Day(s):</span> 
                            <div class="form-group">
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-mon" name="office_mon" value="monday"
                                checked={state.office_mon}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-mon" class="custom-control-label">Mon</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-tues" name="office_tues" value="tuesday"
                                checked={state.office_tues}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-tues" class="custom-control-label">Tues</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-wed" name="office_wed" value="wednesday"
                                checked={state.office_wed}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-wed" class="custom-control-label">Wed</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-thurs" name="office_thurs" value="thursday"
                                checked={state.office_thurs}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-thurs" class="custom-control-label">Thurs</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-fri" name="office_fri" value="friday"
                                checked={state.office_fri}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-fri" class="custom-control-label">Fri</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-sat" name="office_sat" value="saturday"
                                checked={state.office_sat}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-sat" class="custom-control-label">Sat</label>
                            </div>
                            <div class="custom-control custom-checkbox custom-control-inline">
                                <input type="checkbox" class="custom-control-input" id="oh-sun" name="office_sun" value="sunday"
                                checked={state.office_sun}
                                onChange={handleChangeCheckbox}
                                />
                                <label for="oh-sun" class="custom-control-label">Sun</label>
                            </div>  
                        </div>
                    </div>
                    <div class="form-row">
                            <div class="col">
                            <label id="oh-start-time">Start Time:</label>
                            <input type="time" id="oh-start-time"
                            name="office_start_time"
                            value={state.office_start_time}
                            onChange={handleChange}
                            />
                            </div>
                            <div class="col">
                            <label id="oh-end-time">End Time:</label>
                            <input type="time" id="oh-end-time"
                            name="office_end_time"
                            value={state.office_end_time}
                            onChange={handleChange}
                            />
                            </div>  
                        </div>
                        <div class="add-another">
                            <button class="btn btn-outline-secondary btn-sm"> 
                            + Add Another Office Hours Timeslot
                            </button>
                        </div>
                    </div>
                </fieldset>
              
                <fieldset>
                    <legend>Course Goals & Objectives</legend>
                    <div class="form-section">
                        <p class="description">
                        Description for information in this section goes here.
                        </p>
                        <label for="objectives">Course Goals and Objectives:</label>
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextCourseGoal', text)} />
                    </div>
                    
                </fieldset>

                <fieldset>
                    <legend>Prerequisites</legend>
                    <div class="form-section">
                        <p class="description">
                        Description for information in this section goes here.
                        </p>
                        <label for="prerequisites">Prerequisites:</label>
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextPrereq', text)} />
                    </div>
                </fieldset>
         
                <fieldset>
                    <legend>Required Materials</legend>
                    
                    <div class="form-section">
                        <p class="description">
                        Description for information in this section goes here.
                        </p>
                        <label for="required-textbooks">
                        Required Textbooks:</label>
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextRequiredTextbooks', text)} /> <br/>
                        <label for="required-materials">
                        Additional Required Materials:</label>
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextAdditionalRequiredMaterials', text)} /> <br/>
                        <label for="lab-information">
                        Lab Information:
                        </label> 
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextLabInfo', text)} />
                       
                        <div class="radio-set">
                                <div class="custom-control custom-checkbox custom-control-inline">
                            <input type="checkbox" id="no-required-materials" class="custom-control-input"/>
                            <label for="no-required-materials" class="custom-control-label">
                            There are no required materials for this course.
                            </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                
                 <fieldset>
                    <legend>Additional Materials</legend>
                    <div class="form-section">
                        <p class="description">
                        Description for information in this section goes here.
                        </p>
                        <label for="additional-materials">
                        Additional Materials:</label> 
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextAdditionalMaterials', text)} />
                       
                    </div>
                </fieldset>
             
                <fieldset>
                    <legend>Assessment and Grading Scale</legend>
                    <div class="form-section">
                        <p class="description">
                        Description for information in this section goes here.
                        </p>
                    <div>
                        <label for="exam-policies">Exam Policies:</label> 
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextExamPolicies', text)} />
                       
                    </div>
                    <div>
                        <h4>Grading Scale</h4>
                        <div class="radio-set">
                            <span class="title">Type of Grade: </span> 
                            <div class="form-group">
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="percent-grade" name="grade-type" value="percent" class="custom-control-input" checked/>
                                    <label for="percent-grade" class="custom-control-label">Percent</label>
                                </div>
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="point-grade" name="grade-type" value="point" class="custom-control-input"/>
                                    <label for="point-grade" class="custom-control-label">Points</label>
                                </div>
                            </div>
                        </div>
                        <>
                        <div class="grade-scale">
                        <ul>
                            <li>
                                <label class="letter">A</label>   
                                <span class="range"> <input type="number" min="0" value="94"/>  to <input type="number" min="0" value="100"/> 
                                </span>
                            </li>
                            <li>
                                <label class="letter">A-</label>  
                                <span class="range">
                                    <input type="number" min="0" value="90"/>  to <input type="number" min="0" value="94"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">B+</label>  
                                <span class="range">
                                    <input type="number" min="0" value="87"/>  to <input type="number" min="0" value="90"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">B</label>  
                                <span class="range">
                                    <input type="number" min="0" value="83"/>  to <input type="number" min="0" value="87"/>
                                </span>
                             </li>
                            <li>
                                <label class="letter">B-</label>  
                                <span class="range">
                                    <input type="number" min="0" value="80"/>  to <input type="number" min="0" value="83"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">C+</label>  
                                <span class="range">
                                    <input type="number" min="0" value="77"/> to <input type="number" min="0" value="80"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">C</label>  
                                <span class="range">
                                    <input type="number" min="0" value="70"/>  to <input type="number" min="0" value="77"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">D</label>  
                                <span class="range">
                                    <input type="number" min="0" value="60"/>  to <input type="number" min="0" value="70"/>
                                </span>
                            </li>
                            <li>
                                <label class="letter">F</label>  
                                <span class="range">
                                    <span> below </span>
                                    <input type="number" min="0" value="60"/>
                                </span>
                            </li>
                        </ul>
                        </div>
                      </>
                    </div>
                </div>
              
                </fieldset>
           
                <fieldset>
                    <legend>Detailed Course Schedule</legend>
                    <div class="form-section">
                        <p class="description">
                        A course schedule can be automatically generated based on meeting times and days. You can choose to fill it in later or use this app to do so.</p>
                        <div class="form-group">
                            <div class="custom-control custom-radio not-inline">
                                <input type="radio" id="include-schedule" value="include-schedule" name="schedule-type" class="custom-control-input" checked/>
                                <label for="include-schedule" class="custom-control-label">
                                    Include empty weekly schedule in syllabus
                                </label>
                            </div>
                            <div class="custom-control custom-radio not-inline">
                                <input type="radio" id="separate-schedule" value="separate-schedule" name="schedule-type" class="custom-control-input"/>
                                <label for="separate-schedule" class="custom-control-label">
                                    Generate empty weekly schedule in a separate file
                                </label>
                            </div>
                            <div class="custom-control custom-radio not-inline">
                                <input type="radio" id="build-schedule" value="build-schedule" name="schedule-type" class="custom-control-input"/>
                                <label for="build-schedule" class="custom-control-label">
                                    Build schedule with app
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
               
                <fieldset>
                    <legend>Additional Syllabus Content</legend>
                    <div class="form-section">
                        <p class="description">
                        Include any additional content you would like in the syllabus here.
                        </p>
                        <label for="additional-content">Additional Content:</label>
                        <RichEditorExample setPlainText={text => handleRichEditorChange('RichTextAdditionalContent', text)} />
                       
                    </div>
                </fieldset>
               
                <fieldset disabled="">
                    <legend>Required Policies</legend>
                    <div class="form-section">
                        <p class="description">
                        These policies will be included in the generated syllabus. Click on a policy to see a preview of it.
                        </p>
                        <div class="form-group">
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-ai" value="academic-integrity" class="custom-control-input" checked/>
                                <label for="policy-ai" class="custom-control-label">

                                    <div >
                                        <a className="read-more-link" onClick={()=>{setReadMore(!readMore)}}><span>{linkName}</span></a>
                                            {readMore && extraContent}
                                    </div>

                                </label>
                            </div>
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-da" value="disability-access" class="custom-control-input" checked/>
                                <label for="policy-da" class="custom-control-label">
                                    <a href=""> Disability Statement  </a>
                                    
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-cs" value="counseling-services" class="custom-control-input" checked/>
                                <label for="policy-cs" class="custom-control-label">
                                    <a href="">Counselling and Psychological Services Statement</a> 
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-ee" value="educational-equity" class="custom-control-input" checked/>
                                <label for="policy-ee" class="custom-control-label">
                                    <a href="">Educational Equity</a>
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-mr" value="mandated-reporting" class="custom-control-input" checked/>
                                <label for="policy-mr" class="custom-control-label"> 
                                    <a href="">Mandated Reporting</a>
                                </label>
                            </div>
                            <div class="custom-control custom-checkbox not-inline">
                                <input type="checkbox" id="policy-c19" value="covid-19-statements" class="custom-control-input" checked/>
                                <label for="policy-c19" class="custom-control-label">
                                    <a href="">Covid-19 Statements</a>
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="line-break"></div>
    
                    <div id="submitbutton">
                        <button type="submit" id="submit" class="btn btn-primary btn-lg">
                            Generate a full syllabus
                        </button>   
                    </div>
                </form>
    
               
                </div>
            </div>
            </div>

            <div id="results" class="col results">
                <div class="box">
                    <h2>Syllabus Checklist</h2>
                    <div class="checklist">
                    <ul>
                        <li>Course Information</li>
                        <ul>
                            <li><span class="optional-symbol">O</span> Course Number  
                            {state.course_num !== "" && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                            <li><span class="optional-symbol">O</span> Course Name
                            {state.course_name !== "" && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                            <li><span class="optional-symbol">O</span> Scheduled Meeting Location
                            {state.meeting_location !== "" && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                            <li><span class="optional-symbol">O</span> Scheduled Meeting Times
                            {state.course_meeting_type !== "" && state.course_start_times !== ""&& state.course_end_times !== "" && (state.meeting_mon || state.meeting_tues || state.meeting_wed || state.meeting_thurs || state.meeting_fri || state.meeting_sat || state.meeting_sun) && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                        </ul>
                        <li>Contact information</li>
                        <ul>
                            <li><span class="required-symbol">R</span> Instructor Name 
                            {state.instructor_name !== "" && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                            <li><span class="required-symbol">R</span> Instructor Phone/Email 
                            {state.email !== "" && state.phone !== "" && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                            <li><span class="required-symbol">R</span> Office Hours 
                            {state.office_start_time !== "" && state.office_end_time !== "" && (state.office_mon || state.office_tues || state.office_wed || state.office_thurs || state.office_fri || state.office_sat || state.office_sun) && (
                                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            )}
                            </li>
                        </ul>
                        <li>Course Description</li>
                        <ul>
                            <li><span class="required-symbol">R</span> Course goals and objectives </li>
                            <li><span class="optional-symbol">O</span> Prerequisites</li>
                            <li><span class="required-symbol">R</span> Required Materials </li>
                            <li><span class="optional-symbol">O</span> Additional Materials</li>
                            <li><span class="required-symbol">R</span> Assessment and Grading Scale</li>
                            <li><span class="required-symbol">R</span> Examination Policy/Schedule </li>
                            <li><span class="optional-symbol">O</span> Detailed Course Schedule</li>
                        </ul>
                        <li>Additional Content</li>
                        <ul>
                            <li><span class="optional-symbol">O</span> Custom Content</li>
                        </ul>
                        <li>Required Policies</li>
                        <ul>
                            <li><span class="required-symbol">R</span> Academic Integrity Statement <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                            <li><span class="required-symbol">R</span> Disability Statement <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                            <li><span class="required-symbol">R</span> Counselling and Psychological Services Statement <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                            <li><span class="required-symbol">R</span> Educational Equity <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                            <li><span class="required-symbol">R</span> Mandated Reporting <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                            <li><span class="required-symbol">R</span> Covid-19 Statements <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                                </svg></li>
                        </ul>
                    </ul>
                    </div>
                </div>
                <div class="box">
                    <h2>Syllabus Preview</h2>
                    <div class="preview">
                    <div class="preview-box">
                        
                        {(state.course_num !== "" || state.course_name !== "" || state.course_section !== ""|| state.meeting_location !== "" ) && (
                                <div>
                                <h4>Course Information</h4>
                                <p>
                                Course Number: {state.course_num} <br/>
                                Course Name: {state.course_name } <br/>
                                Course Section: {state.course_section} <br/>
                                Meeting Location : {state.meeting_location} <br/>
                                </p>
                                </div>
                        )}

                        {(state.course_start_date !== "" || state.course_end_date !== "" || state.course_meeting_type !== ""|| state.meeting_mon  || state.meeting_tues || state.meeting_wed || state.meeting_thurs || state.meeting_fri || state.meeting_sat || state.meeting_sun ) && (
                                <div>
                                <h4>Course Schedule & Meeting Times</h4>
                        <p>
                        Course Start Date : {state.course_start_date} <br/>
                        Course End Date : {state.course_end_date} <br/>
                        Course Meeting Type : {state.course_meeting_type} <br/>
                        Course Meeting Days: { state.meeting_mon ? ("Mon ") : ("") }
                            {state.meeting_mon && (state.meeting_tues || state.meeting_wed ||state.meeting_thurs ||state.meeting_fri || state.meeting_sat ||state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_tues ? ("Tues ") : ("") } 
                            {state.meeting_tues && (state.meeting_wed ||state.meeting_thurs ||state.meeting_fri || state.meeting_sat ||state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_wed ? ("Wed ") : ("") } 
                            {state.meeting_wed && (state.meeting_thurs ||state.meeting_fri || state.meeting_sat ||state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_thurs ? ("Thurs ") : ("") } 
                            {state.meeting_thurs && (state.meeting_fri || state.meeting_sat ||state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_fri ? ("Fri ") : ("") } 
                            {state.meeting_fri && (state.meeting_sat ||state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_sat ? ("Sat ") : ("") } 
                            {state.meeting_sat  && (state.meeting_sun) ? (", ") : ("") }
                            {state.meeting_sun ? ("Sun ") : ("") } <br/>
                        Course Meeting Start Time : {state.course_start_times} <br/>
                        Course Meeting End Time: {state.course_end_times}
                        </p>
                                </div>
                        )}



                        <h4>Contact Information</h4>
                        <p>
                        Instructor Name : {state.instructor_name} <br/>
                        Email : {state.email} <br/>
                        Phone : {state.phone} <br/>
                        Office Location: {state.office_location} <br/>
                        Office Hour Days: { state.office_mon ? ("Mon ") : ("") }
                            {state.office_mon && (state.office_tues || state.office_wed ||state.office_thurs ||state.office_fri || state.office_sat ||state.office_sun) ? (", ") : ("") }
                            {state.office_tues ? ("Tues ") : ("") } 
                            {state.office_tues && (state.office_wed ||state.office_thurs ||state.office_fri || state.office_sat ||state.office_sun) ? (", ") : ("") }
                            {state.office_wed ? ("Wed ") : ("") } 
                            {state.office_wed && (state.office_thurs ||state.office_fri || state.office_sat ||state.office_sun) ? (", ") : ("") }
                            {state.office_thurs ? ("Thurs ") : ("") } 
                            {state.office_thurs && (state.office_fri || state.office_sat ||state.office_sun) ? (", ") : ("") }
                            {state.office_fri ? ("Fri ") : ("") } 
                            {state.office_fri && (state.office_sat ||state.office_sun) ? (", ") : ("") }
                            {state.office_sat ? ("Sat ") : ("") } 
                            {state.office_sat  && (state.office_sun) ? (", ") : ("") }
                            {state.office_sun ? ("Sun ") : ("") } <br/> 
                        Office Hour: {state.office_start_time} 
                        {state.office_start_time === "" ? ("") : (" ~ ")}
                        {state.office_end_time}
                        </p>
                        
                        <div>
                        <h4>Course goals and objectives</h4>
                        <p> {state.RichTextCourseGoal} <br/> </p>
                        </div>
                       
                        {state.RichTextPrereq !== "" && (
                                <div>
                                <h4>Prerequisites</h4>
                                <p>
                                 {state.RichTextPrereq} <br/>
                                </p>
                                </div>
                        )}
 
                       
                                <div>
                                <h4>Required Materials</h4>
                                
                                <p>
                                Required Textbooks: {state.RichTextRequiredTextbooks} <br/>
                                {state.RichTextAdditionalRequiredMaterials === "" ? ("") : ("Additional Required Materials: " + state.RichTextAdditionalRequiredMaterials )} <br/>
                                {state.RichTextLabInfo === "" ? ("") : ("Lab Information: " + state.RichTextLabInfo)}
                                </p>
                                </div>
                        

                        {state.RichTextAdditionalMaterials !== "" && (
                                <div>
                                <h4>Additional Materials: </h4>
                                <p>
                                 {state.RichTextAdditionalMaterials} <br/>
                                </p>
                                </div>
                        )}

                        
                                <div>
                                <h4>Assessment and Grading Scale: </h4>
                                <p>
                                 {"Exam Policies: " + state.RichTextExamPolicies} <br/>
                                </p>
                                </div>
                       

                        {state.RichTextAdditionalContent !== "" && (
                                <div>
                                <h4>Additional Syllabus Content </h4>
                                <p>
                                 {state.RichTextAdditionalContent} <br/>
                                </p>
                                </div>
                        )}

                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div class="footer">
            <p>The policies and syllabus requirements were last updated on 12/03/2020.</p>
        </div>
        </div>
      </> 
  );
}

function InputComponent({input, onChange}) {

    console.log(input)

return (
  
    <div>
        <div>This is the input for {input.name}</div>
        <div>This is the value {input.value}</div>
        <input type="text" name={input.name} onChange={onChange}/>
        <br/>
        <br/>
    </div>
    
)
}



ReactDOM.render(
  //<React.StrictMode>
  //  <App />
  //</React.StrictMode>,
  <React.StrictMode>
    <Function1 />
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

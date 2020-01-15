import React, {Component} from 'react'
import '../css/range.css'


/**
 * @class VerticalRangeSlider
 * @argument {object} props
 * @argument {String} props.name
 * @argument {Number} props.min
 * @argument {Number} props.max
 * @argument {Number} props.initialValue
 * @argument {Number} props.step
 * @argument {String} props.iconTop
 * @argument {String} props.iconBottom
 * @argument {object} props.onChange
 * @argument {Number} props.index
 * @argument {String} props.unit unit to append to end of text input field
 * 
 */
export default class VerticalRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeValue: 0
    };
  }

  static getDerivedStateFromProps(nextProp, prevState) {
    return {
      rangeValue: nextProp.initialValue
    };
  }

  handleRangeChange = (e) => {
    this.setState({
      rangeValue: Number(e.target.value)
    });
    this.props.onChange(this.props.name, Number(e.target.value), this.props.index);
  }

  render() {
    return(
      <div className="row">
        <div className="col s12">
          <div className="row center-align no-margin">
            <label for="input_area">{this.props.name}</label>
          </div>
          <div className="row center-align no-margin">
            <div class="input-field inline">
              <input placeholder={this.props.name} style={{width:'50%'}} id="input_area" type="text" class="validate" value={this.state.rangeValue} onChange={this.handleRangeChange}/>
            </div>
            {this.props.units ? this.props.units : ''}
          </div>
          <div className="row center-align no-margin">
            <img src={this.props.iconTop} height="20px" width="20px"/>
          </div>

          <div className="row center-align no-margin">
            <p className="range-field">
              <input type="range" min={this.props.min} max={this.props.max} step={this.props.step} value={this.state.rangeValue} onChange={this.handleRangeChange} />
            </p>
          </div>

          <div className="row center-align no-margin">
            <img src={this.props.iconBottom} height="20px" width="20px"/>
          </div>
        </div>
      </div>
    );
  }
}

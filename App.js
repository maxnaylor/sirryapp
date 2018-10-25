/**
 * sirryapp
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TextInput, Animated} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class InputField extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            style: styles.blurred,
            text: '',
        };
    }
    
    submitAndClear = () => {
        this.props.writeQuery(this.state.text)
        this.setState({
            text: ''
        })
    }
    
    render() {
        return (
            <TextInput
                {...this.props}
                onBlur = {(style) => this.setState({ style: styles.blurred })}
                onFocus = {(style) => this.setState({ style: styles.focused })}
                onChangeText = {text => this.setState({ text })}
                onSubmitEditing = {this.submitAndClear}
                style = {[styles.inputField, this.state.style]}
                editable = {true}
                multiline = {true}
                numberOfLines = {5}
                placeholder = {'Hvernig get ég aðstoðað þig?'}
                returnKeyType = {'go'}
                enablesReturnKeyAutomatically = {true}
            />
        )
    }
    
}

type Props = {};
export default class App extends Component<Props> {
    
    constructor() {
        super();
        this.state = {
            query: '',
            valueArray: [],
            disabled: false,
        }
        this.index = 0;
    }
    
    appendInput(query) {
        
        fetch('http://maxnaylor.co.uk/sirry/api/?q='+query, { headers: { 'Cache-Control': 'no-cache' } })
        .then((response) => response.json())
        .then((responseJson) => {
              
            this.setState({ outputString: '' });
            let newlyAddedValue = {
                index: this.index,
                type: 'response',
                query: responseJson.outputString,
            }
              
            this.setState({
                disabled: true,
                valueArray: [ ...this.state.valueArray, newlyAddedValue ]
            });
              
        })
        .catch((error) => {
            alert(error);
        });
        
    }

    appendOutput = () => {
        
        let newlyAddedValue = {
            index: this.index,
            type: 'question',
            query: this.state.query
        }
        
        this.appendInput(this.state.query);
        
        this.setState({
            disabled: true,
            valueArray: [ ...this.state.valueArray, newlyAddedValue ]
        });
        
    }
    
    writeQuery = text => {
        this.setState({
            query: text
        })
    }
    
    render() {

        let newArray = this.state.valueArray.map(( item, key ) =>
        {
            return(
                <View key={key} style={[styles.bubble, styles[this.state.valueArray[key].type]]}>
                   <Text style={[styles.response, styles[this.state.valueArray[key].type]]}>{this.state.valueArray[key].query}</Text>
                </View>
            );
        });
        
        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <ScrollView
                    style={styles.conversationView}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                >
                    {
                        newArray
                    }
                </ScrollView>
                <View style={styles.inputContainer}>
                    <InputField
                        //onSubmitEditing = {(text) => this.appendOutput() }
                        writeQuery = {this.writeQuery}
                    />
                </View>
          </KeyboardAvoidingView>
        );
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    conversationView: {
        flex: 1,
        width: '100%',
       // backgroundColor: '#ccc',
        padding: 30,
        paddingTop: 50,
        fontSize: 18,
    },
    response: {
        fontSize: 18,
    },
    question: {
        color: '#fff',
        textAlign: 'right',
    },
    bubble: {
        alignSelf: 'flex-start',
        maxWidth: '80%',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    question: {
        fontSize: 18,
        alignSelf: 'flex-end',
        backgroundColor: '#00a3ff',
        color: '#fff',
        textAlign: 'right',
    },
    response: {
        fontSize: 18,
        backgroundColor: 'rgb(243, 242, 240)',
    },
    inputContainer: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    inputField: {
        fontSize: 18,
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        marginBottom: 40,
        paddingTop: 5,
        paddingBottom: 5,
        width: 280,
    },
    focused: {
        borderBottomWidth: 2,
        borderBottomColor: '#00a3ff',
    },
    blurred:{
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
    },
});

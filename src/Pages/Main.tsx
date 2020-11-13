import React from 'react'
import SideBar from '../Components/SideBar/SideBar'
import '../Components/Layout/container.scss'
import TextBlock from '../Components/TextBlock/TextBlock'
import RecordModal from '../Components/RecordModal/RecordModal'
import {getMobileUser, getDesktopUser} from '../database'
import {connect} from 'react-redux'
import { resetTimer, subtractTimer, 
        toStartTimer, endTest, 
        showRecordModal, closeRecordModal, 
        changeName, showLoader, 
        sendUser, clearValidateNameField,
        invalidName, rewriteArea,
        plusCounertSuccessChars, addAnsweredChar } from '../store/actions/main'
import { RootStateType } from '../store/reducers/root-reducer'
import { AreaType, RecordModalType, TimerType } from '../store/reducers/main'
import { UserType, AnsweredCharType } from '../types/types'
import { RouteComponentProps } from 'react-router-dom'

type GetTimeType = {
    string: string,
    year: string,
    month: string,
    day: string
}

type GetAreaDataType = [string, number]

interface OwnProps extends RouteComponentProps {}
class Main extends React.Component<StateProps & DispatchProps & OwnProps, {}> {

    startTimer = (): void => {
        if (!this.props.timer.finished) {
            const delay = 1000
            
            const timerId: number = window.setInterval(() => {

                if (this.props.timer.seconds <= 1 && this.props.timer.seconds > 0) {
                    this.stopTest(1)
                    return
                }
    
                this.props.subtractTimer()
            }, delay); 

            this.props.toStartTimer(timerId)
        }
    }

    resetTimer = (): void => {
        clearInterval(this.props.timer.intervalId)
        this.props.resetTimer()
    }

    stopTest = (delaySeconds = 0): void => {
        const perSecond = this.props.area.successChars / (this.props.timer.maxSeconds - this.props.timer.seconds + delaySeconds)
        const result = Math.round(perSecond * 60)
        const text = this.getCorrectText(result)

        clearInterval(this.props.timer.intervalId)

        this.props.endTest(result, text)

        setTimeout(() => {
            this.props.showRecordModal()
        }, 300);
    }

    getCorrectText(num: number) {
        const stringNumber = num + ''
        const lastNum = +stringNumber.slice(-1)
        if (lastNum === 0) {
            return 'символов'
        } else if (lastNum === 1) {
            return 'символ'
        } else if (lastNum >= 2 && lastNum <= 4) {
            return 'символа'
        } else if (lastNum >= 5 && lastNum <= 9) {
            return 'символов'
        }
        return ''
    }

    changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const name = e.target.value + ''
        this.clearValidateName()

        this.props.changeName(name)
    }

    getTime(): GetTimeType {
        const date = new Date()
        const year = date.getFullYear() + ''
        let month = date.getMonth() + 1 + ''
        let day = date.getDate() + ''

        month = month.length === 1 ? '0' + month : month
        day = day.length === 1 ? '0' + day : day
            
        return {
            string: [day, month, year].join('-'),
            year, month, day
        }
    }

    hasSameUserName = async (name: string): Promise<boolean> => {
        this.props.showLoader()
        const mobileUser = await getMobileUser(name)
        const desktopUser = await getDesktopUser(name)
        return (mobileUser === null && desktopUser === null) ? false : true
    }

    sendResults = (name: string): void => {
        const date = this.getTime()
        const user = {
            name,
            points: this.props.recordModal.result,
            date,
        }      

        this.props.sendUser(user)
    }

    clearValidateName = (forceClean = false): void => {
        if (!this.props.recordModal.valid || forceClean) {
            this.props.clearValidateNameField()
        }
    }

    submitNameHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        // @ts-ignore
        const name: string = e.nativeEvent.target.userName.value.trim()
        const depricatedChars = name.split(/[a-zA-ZА-ЯЁа-яё]+|\d+|\s+/g).join('')

        let message = ''
        let valid = true

        if (name.length === 0) {
            message = 'Введите имя пользователя'
            valid = false

        } else if (name.length > 18) {
            message = `Максимальная длинна имени 18 символов, у Вас ${name.length} ${this.getCorrectText(name.length)}`
            valid = false

        } else if (depricatedChars.length > 0) {
            message = 'Используйте только буквы, цифры и пробел!'
            valid = false

        } else if (await this.hasSameUserName(name)) {
            message = 'Это имя уже занято'
            valid = false
        }
        
        if (valid === true) {          
            this.clearValidateName(true)
            this.sendResults(name)
        }

        if (valid === false) {
            this.props.invalidName(message)
        }   
    }

    getAreaData = (e: React.ChangeEvent<HTMLTextAreaElement>): GetAreaDataType => {
        const valueOfState = this.props.area.value
        let inputValue = e.target.value
        const lastChar = inputValue.slice(-1)

        if ( (inputValue.length - valueOfState.length) > 1) {
            inputValue = valueOfState + lastChar

        } else if ( valueOfState.length > inputValue.length) {
            inputValue = valueOfState.slice(0, -1)
        }
        const indexChar = inputValue.length - 1

        this.props.rewriteArea(inputValue)
        return [lastChar, indexChar]
    }
    
    handleAreaInput = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const [lastChar, indexChar] = this.getAreaData(e)
        const isWrittenAll = indexChar >= this.props.area.chars.length - 1

        if (!this.props.timer.started) {
            this.startTimer()
        }

        const isSuccess = this.props.area.chars[indexChar] === lastChar
        const isWritten = !!(this.props.area.answeredChars[indexChar]) || indexChar < 0
        const className = isSuccess ? 'success' : 'error'
    
        if (isWritten) {
            return
        }
    
        if (className === 'success') {
            this.props.plusCounertSuccessChars()
        }
    
        const newAnsweredChars = [...this.props.area.answeredChars]
        newAnsweredChars.push({index: indexChar, class: className})
    
        this.props.addAnsweredChar(newAnsweredChars)

        if (isWrittenAll) {
            this.stopTest()
        }
    }

    render() {       
        return (
            <React.Fragment>
                <div className='container'>
                    <SideBar 
                        className='sideBar'
                        startedTimer={this.props.timer.started}
                        finishedTimer={this.props.timer.finished}
                        seconds={this.props.timer.seconds}
                        startTimer={this.startTimer}
                        resetTimer={this.resetTimer}
                    />

                    <TextBlock
                        startTimer={this.startTimer}
                        isDisabledArea={this.props.timer.finished}

                        area={this.props.area}
                        handleAreaInput={this.handleAreaInput}
                    />
                </div>

                <RecordModal 
                    isShow={this.props.recordModal.isShow}
                    closeRecordModal={this.props.closeRecordModal}
                    result={this.props.recordModal.result}
                    text={this.props.recordModal.text}
                    submitNameHandler={this.submitNameHandler}
                    clearValidateName={this.clearValidateName}
                    isShowAlert={this.props.recordModal.alert.isShowAlert}
                    alertMessage={this.props.recordModal.alert.message}
                    showLoader={this.props.recordModal.showLoader}
                    statusSendName={this.props.recordModal.statusSendName}
                    nameValue={this.props.recordModal.nameValue}
                    changeNameHandler={this.changeNameHandler}
                />

            </React.Fragment>
        )
    }
}
type StateProps = {
    timer: TimerType,
    area: AreaType,
    recordModal: RecordModalType
}
function mapStateToProps(state: RootStateType): StateProps {
    return {
        timer: state.main.timer,
        area: state.main.area,
        recordModal: state.main.recordModal
    }
}

type DispatchProps = {
    subtractTimer: () => void,
    toStartTimer: (timerId: number) => void,
    resetTimer: () => void,
    endTest: (result: number, text: string) => void,
    showRecordModal: () => void,
    closeRecordModal: () => void,
    changeName: (name: string) => void,
    showLoader: () => void,
    sendUser: (user: UserType) => void,
    clearValidateNameField: () => void,
    invalidName: (message: string) => void,
    rewriteArea: (value: string) => void,
    plusCounertSuccessChars: () => void,
    addAnsweredChar: (newChars: Array<AnsweredCharType>) => void
}
const mapDispatch: DispatchProps = {
    subtractTimer: () => subtractTimer(),
    toStartTimer: timerId => toStartTimer(timerId),
    resetTimer: () => resetTimer(),
    endTest: (result, text) => endTest(result, text),
    showRecordModal: () => showRecordModal(),
    closeRecordModal: () => closeRecordModal(),
    changeName: name => changeName(name),
    showLoader: () => showLoader(),
    sendUser: user => sendUser(user),
    clearValidateNameField: () => clearValidateNameField(),
    invalidName: message => invalidName(message),
    rewriteArea: value => rewriteArea(value),
    plusCounertSuccessChars: () => plusCounertSuccessChars(),
    addAnsweredChar: newChars => addAnsweredChar(newChars)
}
export default connect<StateProps, DispatchProps, OwnProps, RootStateType>(mapStateToProps, mapDispatch)(Main)


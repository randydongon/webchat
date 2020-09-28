
export const initialState = {
  user: '',
  isChat: false,
  name: '',
  url: '',
  id: '',
  isLogin: false,
  login: [],
  chatname: '',
  chatemail: '',
  chaturl: '',
  chatid: '',
  notify: 0,

}

const reducer = (state, action) => {

  switch (action.type) {
    case 'IS_USER_LOGIN':
      return {
        ...state,
        isLogin: action.isLogin,
      }
    case 'CHATROOM_IS_OPEN':
      return {
        ...state,
        isChat: action.isChat,
        name: action.name,
        url: action.url,
        id: action.id,
        chatname: action.chatname,
        chatemail: action.chatemail,
        chaturl: action.chaturl,
        chatid: action.chatid,
        notify: action.notify,
      }
    case 'CHAT_IS_OPEN':

      return {
        ...state,
        isChat: action.isChat,
        name: action.name,
        url: action.url,
        id: action.id,
        isLogin: action.isLogin,
      };

    default:
      return state;
  }
}

export default reducer;
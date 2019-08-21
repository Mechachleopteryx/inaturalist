import _ from "lodash";
import { fetch } from "../util";

const SHOW_MODERATOR_ACTION_FORM = "observations-shared/moderator_actions/show_moderator_action_form";
const HIDE_MODERATOR_ACTION_FORM = "observations-shared/moderator_actions/hide_moderator_action_form";

const moderatorActionReducer = ( state = {
  visible: false,
  item: null,
  action: "hide"
}, action ) => {
  if ( action.type === SHOW_MODERATOR_ACTION_FORM ) {
    console.log( "[DEBUG] reducing SHOW_MODERATOR_ACTION_FORM" );
    state.visible = true;
    state.item = action.item;
    if ( action.action === "unhide" ) {
      state.action = "unhide";
    }
  } else if ( action.type === HIDE_MODERATOR_ACTION_FORM ) {
    state.visible = false;
  }
  return state;
};

const showModeratorActionForm = ( item, action ) => (
  {
    type: SHOW_MODERATOR_ACTION_FORM,
    item,
    action
  }
);

const submitModeratorAction = ( item, action, reason ) => (
  function ( ) {
    const data = new FormData( );
    data.append( "authenticity_token", $( "meta[name=csrf-token]" ).attr( "content" ) );
    const isID = !!item.taxon;
    if ( isID ) {
      data.append( "moderator_action[resource_type]", "Identification" );
    } else {
      data.append( "moderator_action[resource_type]", "Comment" );
    }
    data.append( "moderator_action[resource_id]", item.id );
    data.append( "moderator_action[reason]", reason );
    data.append( "moderator_action[action]", action );
    return fetch( "/moderator_actions.json", {
      method: "POST",
      body: data
    } ).then( response => {
      if ( response.status >= 400 ) {
        response.json( ).then( json => {
          let errorText = "Could not save moderator action";
          _.forEach( json.errors, ( v, k ) => {
            errorText += `\n${json.errors[k].map( error => `${k} ${error}` ).join( "\n" )}`;
          } );
          alert( errorText );
        } );
      }
    } ).catch( e => {
      alert( I18n.t( "doh_something_went_wrong_error", { error: e.message } ) );
    } );
  }
);

const hideModeratorActionForm = ( ) => ( {
  type: HIDE_MODERATOR_ACTION_FORM
} );

export default moderatorActionReducer;
export {
  showModeratorActionForm,
  hideModeratorActionForm,
  submitModeratorAction
};

import {Type} from "io-ts";
import _ from 'lodash'

export const formatType = (type: any): any => {
  if(type._tag === 'InterfaceType' && type.props !== undefined) {
    const a = _.map(type.props, p => p.name)
    return a
  } else {
    return 'nothing'
  }
}
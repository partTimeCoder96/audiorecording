import React,{useState,useEffect} from 'react';
import {View,Text,Platform,PermissionsAndroid,Button} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audiorecordplayer = new AudioRecorderPlayer

export default function Main(props){
    
    const [recordSec,setRecordSec]=useState(0);
    const [recordTime,setRecordTime]=useState(0);
    const [playPoisitionSec,setPlayPoisitionSec]=useState('');
    const [playDurationSec,setPlayDurationSec]=useState('');
    const [playTime,setPlayTime]=useState('')
    const [duration,setDuration]=useState('');
    const startRecord=async ()=>{
        const result=await audiorecordplayer.startRecorder();
        audiorecordplayer.addRecordBackListener((record)=>{
            console.log('record',record);
                setRecordSec(record.current_position)
                setRecordTime(audiorecordplayer.mmssss(Math.floor(record.current_position)))
                return
        })
        console.log('start record',result);
    }

    const stopRecord= async ()=>{
        const result= await audiorecordplayer.stopRecorder();
        audiorecordplayer.removeRecordBackListener();
        setRecordSec(0);
        setRecordTime(0);
        console.log('stoprecord',result);
    }

    const startPlay=async ()=>{
        console.log('start play');
        const msg=await audiorecordplayer.startPlayer();
        console.log('start play msg',msg);
        audiorecordplayer.addPlayBackListener((play)=>{
            console.log('start play addplaybacklistner',play);
            if(play.current_position === play.duration){
                    console.log('finished');
                    audiorecordplayer.stopPlayer();
            }

        setPlayPoisitionSec(play.current_position);
        setPlayDurationSec(play.duration);
        setPlayTime(audiorecordplayer.mmssss(Math.floor(play.current_position)));
        setDuration(audiorecordplayer.mmssss(Math.floor(play.duration)));
        return
        })
    }

    const pausePlay=async ()=>{
 await audiorecordplayer.pausePlayer();
    }

    const stopPlay= async ()=>{
        console.log('stop play');
        audiorecordplayer.stopPlayer();
        audiorecordplayer.removePlayBackListener();
    }
    useEffect(()=>{
        permission()
    })

    async function permission(){
        if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Permissions for write access',
                  message: 'Give permission to your storage to write a file',
                  buttonPositive: 'ok',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the storage');
              } else {
                console.log('permission denied');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }
          if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                  title: 'Permissions for write access',
                  message: 'Give permission to your storage to write a file',
                  buttonPositive: 'ok',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
              } else {
                console.log('permission denied');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }
    }

    return(
        <View>
            <View>
                <Text>{recordSec}</Text>
                <Text>{recordTime}</Text>
            </View>
            <Button onPress={startRecord} title={'start'}/>
            <Button onPress={stopRecord} title={'stop'}/>
            <Button onPress={startPlay} title={'play'}/>
            <Button onPress={pausePlay} title={'pause'}/>
            <Button onPress={stopPlay} title={'stop'}/>
        </View>
    )
}
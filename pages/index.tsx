/** @jsxRuntime classic */
/** @jsx jsx */
import type { NextPage } from 'next';
import { Global, css, jsx } from '@emotion/react';
import { GoogleMap, LoadScript, Marker, InfoBox, InfoWindow } from '@react-google-maps/api';
import { Fragment, useCallback, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

// Components 
import { ClipboardNotesIcon, PlusIcon, TimesIcon } from '../src/iconography';
// Hooks
import { useTasks } from '../src/hooks';
import type { TaskType } from '../src/hooks/use-tasks';
// Utils
import { getMarkerUrl } from '../src/utils';

const Home: NextPage = () => {

  const [ position ] = useGeolocation();
  const [ tasks , addTask ] = useTasks();

  const handleAddTask = useCallback( ({ name, description }) => {
    if( position ){
      addTask({ 
        name: name as string , 
        description: description as string, 
        lat: position.coords.latitude, 
        lng: position.coords.longitude 
      });
    }
  }, [addTask,position]);

  return (
    <Fragment>
      <Global 
        styles = {css`
          html, body, #__next, #__next > div, #__next > div > div {
            height: 100%;
          }
        `}
      />
      <main css = {css`
        height: 100%;
      `}>
        <Mapview position = {position} tasks = {tasks} />
        <BottomNavbar onAddTask = {handleAddTask} />
      </main>
    </Fragment>
  );
};

const primaryColor = "#10C3BF";
const primaryMutedColor = "#84E3DF"
const whiteColor = "#FFF";
const secondaryColor = "#FB5A7C";

const containerStyle = {
  width: '100%',
  height: 'calc(100% - 80px)'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const fieldStyles = css`
  & label {
    display: block;
    margin-bottom: 8px;
  }

  & input {
    width: 100%;
    padding: 16px;
  }

  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  & textarea {
    width: 100%;
    padding: 16px;
  }
`;

type MapviewProps = {
  position: GeolocationPosition | null,
  tasks: TaskType[]
}

const Mapview = ({ position, tasks } : MapviewProps ) => {
  const [ mapInstance , setMapInstance ] = useState< google.maps.Map | null>(null);
  
  useEffect( () => {
    if(mapInstance && position){
      mapInstance.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }
  } , [mapInstance,position] );
  
  return (
    <Fragment>
      <LoadScript googleMapsApiKey = "">
        <GoogleMap onLoad = { (mapInstance) => setMapInstance(mapInstance) } mapContainerStyle = {containerStyle} center = {center} zoom = {10} >
          {position && (
            <Marker position = {{
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }} />
          )}
          {tasks.map( (task,index) => <TaskMarker task = {task} key  = {index} />)}
        </GoogleMap>
      </LoadScript>
    </Fragment>

  );
}

type BottomNavbarProps = {
  onAddTask?: ( { name , description } : { name : string, description: string } ) => void
};

const BottomNavbar = ({ onAddTask } : BottomNavbarProps) => {
  const [ open , setOpen ] = useState(false);
  const [name , setName] = useState("");
  const [description,setDescription] = useState("");
  return (
    <div css = {css`
      height: 80px;
    `} >
      <Dialog.Root>
        <aside css = {css`
          display: flex;
          justify-content: center;
          position: relative;
        `}>
          { open && (
            <div css = {css`
              width: 175px;
              height: 85px;
              position: absolute;
              top: -85px;
              border-top-left-radius: 140px;
              border-top-right-radius: 140px;
              background-color: ${primaryColor};
              padding: 12px 18px 0px 18px;
              display: flex;
              justify-content: center;
              color: ${primaryMutedColor};
            `}>
              <Dialog.Trigger asChild onClick = {() => { setOpen(false); }}>
                <div role = "button" css = {css`
                  width: 28px;
                  height: 28px;
                  cursor: pointer;
                  &:hover {
                    color: ${whiteColor};
                  }
                `}>
                  <ClipboardNotesIcon/>
                </div>
              </Dialog.Trigger>
            </div>
          )}
          <button css = {css`
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${open ? secondaryColor : primaryColor};
            color: ${whiteColor};
            margin-top: -30px;
            position: relative;
            ${ open ? `
              outline: 5px solid ${whiteColor};
            ` : ""}
          `} onClick = {() => {
            setOpen(!open);
          }}>
            <div css = {css`
              width: 24px;
              height: 24px;
            `}>
              { open ? <TimesIcon /> : <PlusIcon />}
            </div>
          </button>
        </aside>
        <Dialog.Content css = {css`
          background-color: ${whiteColor};
          padding: 18px;
          width: 90vw;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 16px;
        `}>
          <Dialog.Title>
            A;adir nueva tarea
          </Dialog.Title>
          <Dialog.Description css = {css`
            color: #B4B3B3;
          `}>
            Al presionar ok se a;adira 
            una tarea en tu posicion
            actual
          </Dialog.Description>
          <div css = {fieldStyles} >
            <label htmlFor = "name">
              Nombre
            </label>
            <input 
              name = "name"
              id = "name"
              placeholder = "Nombre de la tarea"
              value = {name}
              onChange = {(e) => setName(e.target.value)}
            />
          </div>
          <div css = {fieldStyles}>
            <label htmlFor = "description">
              Descripcion
            </label>
            <textarea
              rows = {8}
              name = "description"
              id = "description"
              value = {description}
              placeholder = "Nombre de la tarea"
              onChange = {(e) => setDescription(e.target.value)}
            />
          </div>
          <div css = {css`
            display: flex;
          `}>
            <Dialog.Close onClick = {() => {
              if(typeof onAddTask === 'function'){
                onAddTask({ name, description });
              }
            }} css = {css`
              padding: 16px 24px;
              margin-right: 8px;
              border: 0;
              background-color: ${primaryColor};
              color: ${whiteColor};
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              cursor: pointer;
            `}>
              OK
            </Dialog.Close>
            <Dialog.Close css = {css`
              padding: 16px 24px;
              margin-right: 8px;
              border: 0;
              color: ${primaryColor};
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              background-color: ${whiteColor};
              cursor: pointer;
            `}>
              Cancelar
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

type TaskMarkerProp = {
  task: TaskType
}

const TaskMarker = ({ task } : TaskMarkerProp ) => {
  const [ windowOpen , setWindowOpen ] = useState(false);
  return (
    <Dialog.Root>
      <Marker 
        onClick = {() => { setWindowOpen(!windowOpen); }}
        position = {{
          lat: task.lat,
          lng: task.lng
        }}
        icon={{
          url: getMarkerUrl({}),
          scaledSize: new google.maps.Size(30, 30),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        }}
      />
      { windowOpen && (
        <InfoWindow
          options = {{
            pixelOffset: new google.maps.Size(15,-10)
          }}
          position={{
            lat: task.lat,
            lng: task.lng
          }}
        >
          <div>
            <div>
              Nombre: {task.name}
            </div>
            <Dialog.Trigger asChild onClick = {() => { setWindowOpen(false); }}>
              <button css = {css`
                border: 0;
                background-color: ${primaryColor};
                color: ${whiteColor};
                padding: 4px 16px;
                border-radius: 8px;
                margin-top: 12px;
                cursor: pointer;
              `}>
                ver detalles
              </button>
            </Dialog.Trigger>
          </div>
        </InfoWindow>
      )}
      <Dialog.Content css = {css`
        background-color: ${whiteColor};
        padding: 18px;
        width: 90vw;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
      `}>
          <Dialog.Title>
            {task.name}
          </Dialog.Title>
          <Dialog.Description css = {css`
            color: #B4B3B3;
          `}>
            {task.description}
          </Dialog.Description>
          <div css = {css`
            display: flex;
          `}>
            <Dialog.Close css = {css`
              padding: 16px 24px;
              margin-right: 8px;
              border: 0;
              background-color: ${primaryColor};
              color: ${whiteColor};
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              cursor: pointer;
              margin-top: 16px;
            `}>
              OK
            </Dialog.Close>
          </div>
        </Dialog.Content>
    </Dialog.Root>
  );
}

const useGeolocation = () => {
  const [ position , setPosition ] = useState<GeolocationPosition | null>(null);
  useEffect( () => {
    if( 'geolocation' in navigator ){
      navigator.geolocation.watchPosition( position => {
        setPosition(position);
      });
    }else {
      console.log("Geolocalizacion no disponible");
    }
  } , []);
  return [ position ];
}

export default Home

import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "firebase_setup/firebase";
import { updateUser, selectUserProfile } from 'store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getUser } from 'api/user';


function Profile() {
  const dispatch = useDispatch();
  const curUser = useSelector(selectUserProfile);
  const curParams = useParams();

  const [visitUser, setVisitUser] = useState(null)

  const profileImage = useRef(null);

  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const handleFireBaseUpload = () => {
    console.log("start of upload", imageAsFile);
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(
        `not an image, the image file is a ${typeof imageAsFile}`
      );
      return;
    }
    const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
    uploadBytes(uploadTask, imageAsFile)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        // Get the image download URL
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        console.log("File available at", downloadURL);
        setImageAsUrl({ imgUrl: downloadURL });
        return downloadURL
      })
      .then((url) => {
        const updatedUser = { ...curUser, avatarUrl: url };
        // console.log('?url', url);
        // console.log(updatedUser)
        dispatch(updateUser(updatedUser))
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  useEffect(() => {
    // console.log(imageAsFile)
    if (imageAsFile && curUser._id === curParams.userid) {
      handleFireBaseUpload();
    }
  }, [imageAsFile]);

  useEffect(() => {
    if (curParams.userid !== curUser._id) {
      getUser(curParams.userid)
        .then((response) => {
          // console.log('??')
          setVisitUser(response.data)
        })
        .catch((error) => {
          console.error(`Error retrieving user ${error}`);
        })
    }
  }, [curParams, curUser]);

  const openChooseImage = () => {
    profileImage.current.click();
  };

  const changeProfileImage = (event) => {
    const selected = event.target.files[0];

    if (selected) {
      setImageAsFile(selected);
    }

  };

  return (
    <VStack spacing={3} py={5} borderBottomWidth={1} borderColor="brand.light">
      {curUser._id === curParams.userid ?
      <>
      <Avatar
        size="2xl"
        cursor="pointer"
        onClick={openChooseImage}
        src={curUser.avatarUrl ? curUser.avatarUrl : '/img/Trip.jpg'}
      >
        <AvatarBadge bg="brand.blue" boxSize="1em">
          <svg width="0.4em" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </AvatarBadge>
      </Avatar>
      <input
        hidden
        type="file"
        ref={profileImage}
        onChange={changeProfileImage}
      /> 
      </> : 
      visitUser &&
      <Avatar
        size="2xl"
        cursor="pointer"
        name={visitUser.name}
        src={visitUser.avatarUrl}
      >
      </Avatar>

      }

      <VStack spacing={1}></VStack>
    </VStack>
  )
}


export default Profile

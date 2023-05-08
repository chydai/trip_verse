import { useRef, useState, useEffect } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "firebase_setup/firebase";
import { updateUser, selectUserProfile } from "store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getUser } from "api/user";

export default function Cover() {
  const dispatch = useDispatch();
  const curUser = useSelector(selectUserProfile);
  const curParams = useParams();

  const [visitUser, setVisitUser] = useState(null);

  const profileImage = useRef(null);

  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  const handleFireBaseUpload = () => {
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
      return;
    }
    const uploadTask = ref(storage, `/images/${imageAsFile.name}`);
    uploadBytes(uploadTask, imageAsFile)
      .then((snapshot) => {
        // Get the image download URL
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        setImageAsUrl({ imgUrl: downloadURL });
        return downloadURL;
      })
      .then((url) => {
        const updatedUser = { ...curUser, backgroundUrl: url };
        dispatch(updateUser(updatedUser));
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  useEffect(() => {
    if (imageAsFile && curUser._id === curParams.userid) {
      handleFireBaseUpload();
    }
  }, [imageAsFile]);

  useEffect(() => {
    if (curParams.userid !== curUser._id) {
      getUser(curParams.userid)
        .then((response) => {
          setVisitUser(response.data);
        })
        .catch((error) => {
          console.error(`Error retrieving user ${error}`);
        });
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
    <Box h={60} overflow="hidden" position="relative">
      {curUser._id === curParams.userid ? (
        <Image
          w="full"
          h="full"
          objectFit="cover"
          src={curUser.backgroundUrl ? curUser.backgroundUrl : "/img/cover.jpg"}
          alt="Cover"
        />
      ) : (
        visitUser && (
          <Image
            w="full"
            h="full"
            objectFit="cover"
            src={
              visitUser.backgroundUrl
                ? visitUser.backgroundUrl
                : "/img/cover.jpg"
            }
            alt="Cover"
          />
        )
      )}
      <Button
        onClick={openChooseImage}
        position="absolute"
        top={4}
        right={4}
        variant="ghost"
      >
        <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
        <Text ml={2}>Change Cover</Text>
        <input
          ref={profileImage}
          type="file"
          onChange={changeProfileImage}
          hidden
        />
      </Button>
    </Box>
  );
}

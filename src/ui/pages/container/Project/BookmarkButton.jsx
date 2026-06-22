import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CircularProgress from "@mui/material/CircularProgress";
import { bookmarkProject, unbookmarkProject, getUserProjects } from "../../../../utils/bookmarkService";

const BookmarkButton = ({ projectId, isBookmarked: initialBookmarked, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);
  const [loading, setLoading] = useState(initialBookmarked === undefined);

  useEffect(() => {
    let isMounted = true;
    if (initialBookmarked === undefined) {
      const fetchBookmarkStatus = async () => {
        try {
          const data = await getUserProjects();
          const bookmarkedIds = (data.results || []).map((p) => p.id);
          if (isMounted) {
            setIsBookmarked(bookmarkedIds.includes(projectId));
          }
        } catch (err) {
          console.error(err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchBookmarkStatus();
    } else {
      setIsBookmarked(initialBookmarked);
    }
    return () => {
      isMounted = false;
    };
  }, [initialBookmarked, projectId]);

  const handleToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        await unbookmarkProject(projectId);
        setIsBookmarked(false);
        if (onBookmarkChange) onBookmarkChange(projectId, false);
      } else {
        await bookmarkProject(projectId);
        setIsBookmarked(true);
        if (onBookmarkChange) onBookmarkChange(projectId, true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={24} sx={{ m: 1 }} />;
  }

  return (
    <Tooltip title={isBookmarked ? "Remove Bookmark" : "Bookmark Project"}>
      <IconButton 
        onClick={handleToggle} 
        sx={{ 
          color: isBookmarked ? '#f57c00' : 'rgba(0, 0, 0, 0.54)',
          padding: '8px'
        }}
      >
        {isBookmarked ? <StarIcon fontSize="medium" /> : <StarBorderIcon fontSize="medium" />}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;

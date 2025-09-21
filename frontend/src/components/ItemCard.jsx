import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  SwapHoriz as SwapIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ 
  item, 
  showOwner = true, 
  compact = false,
  onFavorite,
  onShare,
  onViewDetails,
  onMakeOffer 
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(item.id, !isFavorite);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(item);
    } else {
      // Implementação padrão de compartilhamento
      navigator.share?.({
        title: item.title,
        text: item.description,
        url: window.location.origin + `/item/${item.id}`,
      });
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(item);
    } else {
      navigate(`/item/${item.id}`);
    }
  };

  const handleMakeOfferClick = (e) => {
    e.stopPropagation();
    if (onMakeOffer) {
      onMakeOffer(item);
    } else {
      navigate(`/item/${item.id}#offer`);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        position: 'relative',
      }}
      onClick={handleCardClick}
    >
      {/* Imagem do Item */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={compact ? 150 : 200}
          image={item.image || '/api/placeholder/300/200'}
          alt={item.title}
        />
        
        {/* Ações de Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          
          <IconButton
            size="small"
            onClick={handleShareClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Badge de Categoria */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        >
          <Chip
            label={item.category}
            size="small"
            color="primary"
            sx={{ backgroundColor: 'rgba(25, 118, 210, 0.9)' }}
          />
        </Box>

        {/* Badge de Ofertas */}
        {item.offerCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
            }}
          >
            <Chip
              label={`${item.offerCount} ofertas`}
              size="small"
              color="secondary"
              sx={{ backgroundColor: 'rgba(220, 0, 78, 0.9)', color: 'white' }}
            />
          </Box>
        )}
      </Box>

      {/* Conteúdo do Card */}
      <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
        <Typography
          variant={compact ? 'subtitle2' : 'h6'}
          component="h3"
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: compact ? '2.4em' : '2.8em',
          }}
        >
          {item.title}
        </Typography>

        {!compact && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {item.description}
          </Typography>
        )}

        {/* Localização */}
        <Box display="flex" alignItems="center" mb={1}>
          <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {item.location}
          </Typography>
        </Box>

        {/* Condição do Item */}
        {item.condition && (
          <Box mb={1}>
            <Chip
              label={item.condition}
              size="small"
              variant="outlined"
              color="success"
            />
          </Box>
        )}

        {/* Informações do Proprietário */}
        {showOwner && item.owner && (
          <Box display="flex" alignItems="center" mt={2}>
            <Avatar
              src={item.owner.avatar}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {item.owner.name}
            </Typography>
            {item.owner.rating && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                ⭐ {item.owner.rating}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Ações do Card */}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          Ver Detalhes
        </Button>
        <Button
          size="small"
          color="secondary"
          startIcon={<SwapIcon />}
          onClick={handleMakeOfferClick}
          sx={{ ml: 'auto' }}
        >
          Fazer Oferta
        </Button>
      </CardActions>

      {/* Indicador de Novo Item */}
      {item.isNew && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: -8,
            backgroundColor: 'error.main',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          N
        </Box>
      )}
    </Card>
  );
};

export default ItemCard;
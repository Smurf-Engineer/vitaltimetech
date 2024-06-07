"use client";

// components/DraggableList.tsx
import { useState, useRef } from 'react';

interface Item {
  id: number;
  title: string;
  location: string;
  image: string;
}

const initialItems: Item[] = [
  { id: 1, title: 'Scotland Island', location: 'Sydney, Australia', image: '/images/image1.png' },
  { id: 2, title: 'The Charles Grand Brasserie & Bar', location: 'Lorem ipsum, Dolor', image: '/images/image2.png' },
  { id: 3, title: 'Bridge Climb', location: 'Dolor, Sit amet', image: '/images/image3.png' },
  { id: 4, title: 'Scotland Island', location: 'Sydney, Australia', image: '/images/image4.png' },
  { id: 5, title: 'Clam Bar', location: 'Etcetera veni, Vidi vici', image: '/images/image5.png' },
  { id: 6, title: 'Vivid Festival', location: 'Sydney, Australia', image: '/images/image6.png' },
];

const DraggableList = () => {
  const [items, setItems] = useState(initialItems);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'above' | 'below' | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  
    // Create the drag ghost element
    const dragGhost = document.createElement('div');
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-9999px'; // Place it out of the visible area initially
    dragGhost.style.height = '64px';
    dragGhost.style.width = '288px';
    dragGhost.style.borderWidth = '1px';
    dragGhost.style.padding = '16px';
    dragGhost.style.borderRadius = '8px';
    dragGhost.style.backgroundColor = 'white';
    dragGhost.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    dragGhost.style.display = 'flex';
    dragGhost.style.alignItems = 'center';
    dragGhost.style.opacity = '0.9'; // Set some transparency
  
    // Add image to the drag ghost
    const image = document.createElement('img');
    image.src = items[index].image;
    image.style.width = '48px';
    image.style.height = '48px';
    image.style.borderRadius = '5px';
    image.style.marginRight = '10px';
    image.style.marginRight = '20px';
    dragGhost.appendChild(image);
  
    // Add text to the drag ghost
    const text = document.createElement('div');
    text.textContent = items[index].title;
    text.style.fontSize = '18px';
    text.style.fontWeight = 'bold';
    dragGhost.appendChild(text);
  
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
  
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  const handleDragEnter = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    if (draggedItemIndex === null) return;
    const target = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < target.top + target.height / 2 ? 'above' : 'below';
    setDragOverItemIndex(index);
    setDragOverPosition(position);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    console.log(draggedItemIndex, dragOverItemIndex)
    if (draggedItemIndex === null || dragOverItemIndex === null || dragOverPosition === null || draggedItemIndex === dragOverItemIndex) return;

    const itemsCopy = [...items];
    const [draggedItem] = itemsCopy.splice(draggedItemIndex, 1);
    const dropIndex = dragOverPosition === 'above' ? dragOverItemIndex : dragOverItemIndex + 1;
    
    if (dragOverItemIndex > draggedItemIndex) {
      itemsCopy.splice(dropIndex - 1, 0, draggedItem);
    } else {
      itemsCopy.splice(dropIndex, 0, draggedItem);
    }

    setItems(itemsCopy);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setDragOverPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    setDragOverPosition(null);
  };

  const getStyles = (index: number) => {
    if (index === draggedItemIndex) {
      return 'opacity-20';
    }
    return '';
  };

  return (
    <div className="draggable-board space-y-0">
      {items.map((item, index) => (
        <div key={item.id}>
          {dragOverItemIndex === index && dragOverPosition === 'above' && (
            <div className="draggable-line"></div>
          )}
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(index, e)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`draggable-item p-4 border bg-white cursor-pointer ${getStyles(index)}`}
          >
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.title} className="image w-24 h-24  object-cover mr-4" />
              <div style={{padding: '0px 4px 0px 4px', gap: '4px'}}>
                <h3 className="title font-bold mb-2">{item.title}</h3>
                <div className='flex' style={{gap: '4px'}}> 
                  <div className='icon'><img src='/images/icon.png'/></div>
                  <div className="location text-sm text-gray-600">{item.location}</div>
                </div>
              </div>
            </div>
          </div>
          {dragOverItemIndex === index && dragOverPosition === 'below' && (
            <div className="draggable-line"></div>
          )}
        </div>
      ))}
      {dragOverItemIndex === items.length && (
        <div className="draggable-line"></div>
      )}
    </div>
  );
};

export default DraggableList;